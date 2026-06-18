const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('[data-nav-links]');
const year = document.querySelector('#year');
const root = document.documentElement;

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const canAnimatePointer = window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (canAnimatePointer) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const animateGlow = () => {
    currentX += (mouseX - currentX) * 0.1;
    currentY += (mouseY - currentY) * 0.1;
    root.style.setProperty('--mouse-x', `${currentX}px`);
    root.style.setProperty('--mouse-y', `${currentY}px`);
    requestAnimationFrame(animateGlow);
  };

  animateGlow();

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -3.5;
      const rotateY = ((x / rect.width) - 0.5) * 3.5;

      card.style.setProperty('--card-x', `${x}px`);
      card.style.setProperty('--card-y', `${y}px`);
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  document.querySelectorAll('.magnetic').forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.1}px, ${y * 0.14}px)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-links a');

if ('IntersectionObserver' in window && sections.length && navItems.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        navItems.forEach((link) => link.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');
      });
    },
    { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}


// Splash screen
const splashScreen = document.querySelector('[data-splash-screen]');

const hideSplash = () => {
  if (!splashScreen || splashScreen.classList.contains('splash-hidden')) return;
  splashScreen.classList.add('splash-hidden');
  window.setTimeout(() => {
    splashScreen.setAttribute('aria-hidden', 'true');
  }, 720);
};

if (splashScreen) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const splashDelay = prefersReducedMotion ? 900 : 4700;
  window.setTimeout(hideSplash, splashDelay);
}

// Interactive Linux terminal portfolio mode
const terminalPortfolio = document.querySelector('[data-terminal-portfolio]');
const openTerminalButtons = document.querySelectorAll('[data-open-terminal]');
const closeTerminalButtons = document.querySelectorAll('[data-close-terminal]');
const terminalOutput = document.querySelector('[data-terminal-output]');
const terminalForm = document.querySelector('[data-terminal-form]');
const terminalInput = document.querySelector('[data-terminal-input]');
const terminalScreen = document.querySelector('[data-terminal-screen]');

const terminalState = {
  cwd: '~/portfolio',
  history: [],
  historyIndex: -1,
};

const projects = [
  {
    id: '00',
    name: 'book-review-app',
    title: 'AWS EKS Three-Tier App',
    stack: 'EKS Terraform Aurora-MySQL ECR Kubernetes',
    url: 'https://github.com/PrabalPiya/book-review-app',
    note: 'Frontend and backend containers deployed on AWS EKS with Aurora MySQL and Terraform infrastructure.',
  },
  {
    id: '01',
    name: 'kubernetes-local-deployment-with-minikube',
    title: 'Kubernetes Local Deployment',
    stack: 'Minikube Kubernetes MySQL PVC Services',
    url: 'https://github.com/PrabalPiya/kubernetes-local-deployment-with-minikube',
    note: 'Local Kubernetes practice project with app and database manifests, services, secrets, and persistent storage.',
  },
  {
    id: '02',
    name: 'docker-compose-mutli-container-app',
    title: 'Docker Compose Multi-Container App',
    stack: 'Docker Compose Node.js MySQL Volumes',
    url: 'https://github.com/PrabalPiya/docker-compose-mutli-container-app',
    note: 'Node.js and MySQL running together using Docker Compose to understand service names, env values, and logs.',
  },
  {
    id: '03',
    name: 'dockerized-simple-web-app',
    title: 'Dockerized Simple Web App',
    stack: 'Dockerfile Node.js Ports Logs',
    url: 'https://github.com/PrabalPiya/dockerized-simple-web-app',
    note: 'A simple web app containerized with Docker to practice image builds, port mapping, and container logs.',
  },
];

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const scrollTerminal = () => {
  if (!terminalOutput) return;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
};

const addTerminalCommand = (command) => {
  if (!terminalOutput) return;
  const row = document.createElement('div');
  row.className = 'terminal-command-line';
  row.innerHTML = `<span>visitor@prabal:${terminalState.cwd}$</span><code>${escapeHtml(command)}</code>`;
  terminalOutput.appendChild(row);
};

const addTerminalResponse = (html) => {
  if (!terminalOutput) return;
  const row = document.createElement('div');
  row.className = 'terminal-response';
  row.innerHTML = html;
  terminalOutput.appendChild(row);
  scrollTerminal();
};

const renderLs = () => `
  <div class="terminal-table">
    <div class="terminal-table-row"><span>drwxr-xr-x</span><span>4.0K</span><span>Jun 2026</span><strong>projects/</strong></div>
    <div class="terminal-table-row"><span>-rw-r--r--</span><span>1.1K</span><span>Jun 2026</span><strong>about.txt</strong></div>
    <div class="terminal-table-row"><span>-rw-r--r--</span><span>1.4K</span><span>Jun 2026</span><strong>skills.txt</strong></div>
    <div class="terminal-table-row"><span>-rw-r--r--</span><span>0.8K</span><span>Jun 2026</span><strong>contact.txt</strong></div>
  </div>
`;

const renderProjects = () => `
  <div class="terminal-table">
    ${projects.map((project) => `
      <div class="terminal-table-row">
        <span>drwxr-xr-x</span>
        <span>${project.id}</span>
        <span>project</span>
        <strong>${project.name}/</strong>
      </div>
    `).join('')}
  </div>
  <br />Run <strong>cat projects/00</strong>, <strong>cat projects/01</strong>, <strong>cat projects/02</strong>, or <strong>cat projects/03</strong> for details.
`;

const renderProjectDetail = (id) => {
  const project = projects.find((item) => item.id === id);
  if (!project) return `cat: projects/${escapeHtml(id)}: No such file or directory`;
  return `<strong>${project.title}</strong>\nstack: ${project.stack}\nstatus: completed / documented\nrepo: <a href="${project.url}" target="_blank" rel="noreferrer">${project.url}</a>\n\n${project.note}`;
};

const commandMap = {
  help: () => `Available commands:\n\n  help                  show this help menu\n  whoami                print profile summary\n  man prabal            open portfolio manual page\n  pwd                   print current directory\n  ls                    list portfolio files\n  ls projects           list project directories\n  projects              list project directories\n  cat about.txt         read about file\n  cat skills.txt        read skills file\n  cat contact.txt       read contact file\n  cat projects/00       read AWS EKS project\n  cat projects/01       read Kubernetes Minikube project\n  cat projects/02       read Docker Compose project\n  cat projects/03       read Dockerized web app project\n  open github           open GitHub profile\n  open linkedin         open LinkedIn profile\n  date                  show local browser date\n  history               show typed commands\n  clear                 clear terminal\n  exit                  close terminal`,

  whoami: () => `Prabal Piya\nAspiring DevOps Engineer from Nepal.\nLearning DevOps through small practical projects: Docker, Kubernetes, CI/CD, cloud infrastructure, monitoring, and documentation.`,

  'man prabal': () => `PRABAL(1)                         Portfolio Manual                         PRABAL(1)\n\nNAME\n    Prabal Piya - aspiring DevOps engineer\n\nSYNOPSIS\n    build locally -> containerize -> deploy -> check logs -> document what worked\n\nDESCRIPTION\n    Focused on understanding how applications move from code to running environments.\n    Current practice includes Docker, Kubernetes, Terraform, CI/CD, cloud basics, and monitoring tools.\n\nFILES\n    about.txt       personal summary\n    skills.txt      current tools and learning areas\n    contact.txt     contact links\n    projects/       project notes and repositories`,

  pwd: () => '/home/prabal/portfolio',

  ls: renderLs,
  'ls -la': renderLs,
  'ls -lh': renderLs,
  'ls projects': renderProjects,
  'ls -lh projects': renderProjects,
  projects: renderProjects,

  'cat about.txt': () => `I am building beginner-friendly DevOps projects to understand the real workflow behind deployment.\n\nI try to keep things simple: run locally first, use Docker, move to Compose or Kubernetes, check logs when it breaks, and write down the commands that actually worked.`,

  'cat skills.txt': () => `current_stack=(\n  linux basics\n  docker\n  docker-compose\n  kubernetes + minikube\n  terraform\n  aws + azure basics\n  github actions\n  azure devops\n  ansible\n  bash scripting\n  prometheus + grafana basics\n)`,

  'cat contact.txt': () => `email:    <a href="mailto:prabalpiya03@gmail.com">prabalpiya03@gmail.com</a>\ngithub:   <a href="https://github.com/PrabalPiya" target="_blank" rel="noreferrer">github.com/PrabalPiya</a>\nlinkedin: <a href="https://www.linkedin.com/in/prabalpiya/" target="_blank" rel="noreferrer">linkedin.com/in/prabalpiya</a>`,

  contact: () => commandMap['cat contact.txt'](),

  'cat projects/00': () => renderProjectDetail('00'),
  'cat projects/01': () => renderProjectDetail('01'),
  'cat projects/02': () => renderProjectDetail('02'),
  'cat projects/03': () => renderProjectDetail('03'),

  'open github': () => {
    window.open('https://github.com/PrabalPiya', '_blank', 'noopener,noreferrer');
    return 'opening github.com/PrabalPiya ...';
  },

  'open linkedin': () => {
    window.open('https://www.linkedin.com/in/prabalpiya/', '_blank', 'noopener,noreferrer');
    return 'opening linkedin.com/in/prabalpiya ...';
  },

  date: () => new Date().toString(),
  'uname -a': () => 'PrabalOS portfolio 0.3.1 #devops x86_64 GNU/Linux',
  history: () => terminalState.history.map((item, index) => `${String(index + 1).padStart(3, ' ')}  ${escapeHtml(item)}`).join('\n') || 'history is empty',
};

const runTerminalCommand = (rawCommand) => {
  const command = rawCommand.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!command) return;

  addTerminalCommand(rawCommand.trim());
  terminalState.history.push(rawCommand.trim());
  terminalState.historyIndex = terminalState.history.length;

  if (command === 'clear') {
    if (terminalOutput) terminalOutput.innerHTML = '';
    return;
  }

  if (command === 'exit' || command === 'logout') {
    addTerminalResponse('logout');
    window.setTimeout(closeTerminal, 260);
    return;
  }

  if (command.startsWith('cat projects/')) {
    const id = command.replace('cat projects/', '').replace('/', '').padStart(2, '0');
    addTerminalResponse(renderProjectDetail(id));
    return;
  }

  const handler = commandMap[command];
  if (handler) {
    addTerminalResponse(handler());
    return;
  }

  addTerminalResponse(`${escapeHtml(rawCommand.trim())}: command not found\nType <strong>help</strong> to see available commands.`);
};

const openTerminal = () => {
  if (!terminalPortfolio) return;
  document.body.classList.add('terminal-open');
  terminalPortfolio.setAttribute('aria-hidden', 'false');
  window.setTimeout(() => terminalInput?.focus(), 60);
};

const closeTerminal = () => {
  if (!terminalPortfolio) return;
  document.body.classList.remove('terminal-open');
  terminalPortfolio.setAttribute('aria-hidden', 'true');
};

openTerminalButtons.forEach((button) => {
  button.addEventListener('click', openTerminal);
});

closeTerminalButtons.forEach((button) => {
  button.addEventListener('click', closeTerminal);
});

terminalForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!terminalInput) return;
  const value = terminalInput.value;
  terminalInput.value = '';
  runTerminalCommand(value);
});

terminalInput?.addEventListener('keydown', (event) => {
  if (!terminalState.history.length) return;

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    terminalState.historyIndex = Math.max(0, terminalState.historyIndex - 1);
    terminalInput.value = terminalState.history[terminalState.historyIndex] || '';
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    terminalState.historyIndex = Math.min(terminalState.history.length, terminalState.historyIndex + 1);
    terminalInput.value = terminalState.history[terminalState.historyIndex] || '';
  }
});

terminalScreen?.addEventListener('click', () => terminalInput?.focus());

terminalPortfolio?.addEventListener('click', (event) => {
  if (event.target === terminalPortfolio) closeTerminal();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.body.classList.contains('terminal-open')) {
    closeTerminal();
  }
});
