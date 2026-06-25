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
  }, 560);
};

if (splashScreen) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const splashDelay = prefersReducedMotion ? 900 : 6860;
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

const RESUME_PAGE = 'resume.html';
const RESUME_FILE = 'assets/files/Prabal_Piya_Resume.pdf';

const projects = [
  {
    id: '00',
    name: 'AWS EKS Three-Tier App',
    title: 'AWS EKS Three-Tier App',
    stack: 'EKS, Terraform, Aurora-MySQL, ECR, Kubernetes',
    url: 'https://github.com/PrabalPiya/book-review-app',
    note: 'Frontend and backend containers deployed on AWS EKS with Aurora MySQL and Terraform infrastructure.',
  },
  {
    id: '01',
    name: 'DevOps GitOps Capstone',
    title: 'DevOps GitOps Capstone',
    stack: 'AWS, EKS, Terraform, GitHub Actions, Helm, ArgoCD',
    url: 'https://github.com/PrabalPiya/simple-taskops-devops-capstone.git',
    note: 'A cloud-native DevOps capstone project deploying a containerized full-stack application to AWS EKS using Terraform, GitHub Actions, Amazon ECR, Helm, Argo CD, Prometheus, and Grafana.',
  },
  {
    id: '02',
    name: 'InvoiceFlow DevOps Infrastructure',
    title: 'InvoiceFlow DevOps Infrastructure',
    stack: 'AWS, EC2, Terraform, K3s, GitHub Actions, Helm, ArgoCD, Prometheus, Grafana',
    url: 'https://github.com/PrabalPiya/invoiceflow-devops-infrastructure.git', 
    note: 'Cost-optimized AWS EC2 K3s deployment for InvoiceFlow application using Terraform, Helm, ArgoCD, GitHub Actions, Prometheus, and Grafana.',
  },
  {
    id: '03',
    name: 'Portfolio Website CI/CD',
    title: 'Portfolio Website CI/CD',
    stack: ' HTML, CSS, JavaScript, GitHub Actions, GitHub Pages',
    url: 'https://github.com/PrabalPiya/porfolio-website-CI-CD.git',
    note: 'A personal portfolio website deployed with GitHub Pages and automated using GitHub Actions for a simple CI/CD workflow.',
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
    <div class="terminal-table-row"><span>-rw-r--r--</span><span>1.0K</span><span>Jun 2026</span><strong>resume.txt</strong></div>
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
  help: () => `Available commands:

  help                  show this help menu
  whoami                print profile summary
  man prabal            open portfolio manual page
  pwd                   print current directory
  ls                    list portfolio files
  ls projects           list project directories
  cat about.txt         read about file
  cat skills.txt        read skills file
  cat contact.txt       read contact file
  cat resume.txt        show resume links
  cat projects/00       read AWS EKS Three-Tier App
  cat projects/01       read DevOps GitOps Capstone
  cat projects/02       read Invoiceflow DevOps Infrastructure
  cat projects/03       read Portfolio Website CI/CD
  date                  show local browser date
  clear                 clear terminal
  exit                  close terminal`,

  whoami: () => `Prabal Piya
Aspiring DevOps Engineer from Nepal.
Learning DevOps through small practical projects: Docker, Kubernetes, CI/CD, Cloud Infrastructure, Monitoring, and Documentation.`,

  'man prabal': () => `PRABAL(1)                         Portfolio Manual                         PRABAL(1)

NAME
    Prabal Piya - Aspiring DevOps engineer

SYNOPSIS
    Build -> Containerize -> Deploy -> Check Logs -> Document what worked

DESCRIPTION
    Focused on understanding how applications move from code to running environments.
    Current practice includes Docker, Kubernetes, Terraform, CI/CD, Cloud basics, and Monitoring tools.

FILES
    about.txt       personal summary
    skills.txt      current tools and learning areas
    contact.txt     contact links
    resume.txt      resume view and download links
    projects/       project notes and repositories`,

  pwd: () => '/home/prabal/portfolio',

  ls: renderLs,
  'ls -la': renderLs,
  'ls -lh': renderLs,
  'ls projects': renderProjects,
  'ls -lh projects': renderProjects,
  projects: renderProjects,

  'cat about.txt': () => `I am building beginner-friendly DevOps projects to understand the real workflow behind deployment.

I try to keep things simple: run locally first, use Docker, move to Compose or Kubernetes, check logs when it breaks, and write down the commands that actually worked.`,

  'cat skills.txt': () => `current_stack=(
  linux basics
  docker
  docker-compose
  kubernetes + minikube
  terraform
  aws + azure basics
  github actions
  azure devops
  ansible
  bash scripting
  prometheus + grafana basics
)`,

  'cat contact.txt': () => `email:    <a href="mailto:prabalpiya03@gmail.com">prabalpiya03@gmail.com</a>
github:   <a href="https://github.com/PrabalPiya" target="_blank" rel="noreferrer">github.com/PrabalPiya</a>
linkedin: <a href="https://www.linkedin.com/in/prabalpiya/" target="_blank" rel="noreferrer">linkedin.com/in/prabalpiya</a>`,

  'cat resume.txt': () => {
    window.open(RESUME_PAGE, '_blank', 'noopener,noreferrer');
    return 'opening resume.txt ...';
  },


  date: () => new Date().toString(),
  'uname -a': () => 'PrabalOS portfolio 0.3.1 #devops x86_64 GNU/Linux',
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

  addTerminalResponse(`${escapeHtml(rawCommand.trim())}: command not found
Type <strong>help</strong> to see available commands.`);
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