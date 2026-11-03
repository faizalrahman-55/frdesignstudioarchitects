const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menu = $('.menu-toggle');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  $('.main-nav').classList.toggle('open', open);
  $('span', menu).textContent = open ? '−' : '+';
});
$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  $('.main-nav').classList.remove('open');
  $('span', menu).textContent = '+';
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    menu.click(); menu.focus();
  }
});

const drawingFeatures = {
  light: { title: '01 / INVITING THE LIGHT', copy: 'Deep overhangs frame the view while creating shade. Openings bring daylight into the spaces where life happens.' },
  material: { title: '02 / HONEST MATERIALS', copy: 'The warmth of timber meets the quiet strength of concrete. Texture adds character without unnecessary decoration.' },
  nature: { title: '03 / ROOM FOR NATURE', copy: 'Planted edges and open courtyards bring a sense of calm, connecting everyday spaces with the landscape.' }
};
const annotationToggle = $('#annotation-toggle');
annotationToggle.addEventListener('click', () => {
  const on = annotationToggle.getAttribute('aria-pressed') !== 'true';
  annotationToggle.setAttribute('aria-pressed', String(on));
  $('.drawing-frame').classList.toggle('annotations-on', on);
  $('span', annotationToggle).textContent = on ? '−' : '+';
  if (!on) { $('#drawing-note').hidden = true; $$('.hotspot').forEach(b => b.setAttribute('aria-expanded', 'false')); }
});
$$('.hotspot').forEach(button => button.addEventListener('click', () => {
  const wasOpen = button.getAttribute('aria-expanded') === 'true';
  $$('.hotspot').forEach(b => b.setAttribute('aria-expanded', 'false'));
  $('#drawing-note').hidden = wasOpen;
  if (!wasOpen) {
    button.setAttribute('aria-expanded', 'true');
    const feature = drawingFeatures[button.dataset.feature];
    $('#note-title').textContent = feature.title;
    $('#note-copy').textContent = feature.copy;
  }
}));

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
  let count = 0;
  $$('.project-card').forEach(card => {
    card.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== card.dataset.category;
    if (!card.hidden) count++;
  });
  $('#work-count').textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'PROJECT' : 'PROJECTS'}`;
}));

const projects = {
  sathik: { title: 'Sathik Residence', category: '01 / ARCHITECTURE · RESIDENTIAL', images: [{src:'sathik-residence.jpg',alt:'Sathik Residence front elevation with terracotta frame, timber-toned soffits, and a shaded balcony',caption:'Front elevation'}], copy:'A residential facade defined by a bold terracotta frame, clean horizontal volumes, and a sheltered upper balcony. Vertical screens and warm soffits add depth to the street-facing elevation.', notes:[['PROJECT','Sathik Residence'],['DISCIPLINE','Residential architecture'],['PRESENTATION','Exterior visualization']] },
  kathir: { title: 'Kathir Business Centre', category: '02 / ARCHITECTURE · COMMERCIAL', images:[{src:'kathir-business-centre.jpg',alt:'Kathir Business Centre streetfront with large glazed shopfronts, vertical facade screens, and planted terraces',caption:'Streetfront perspective'}], copy:'A commercial streetfront composed of generous glazing, vertical screens, and planted edges. The layered facade gives the building a clear identity while connecting its ground-floor spaces to the street.', notes:[['PROJECT','Kathir Business Centre'],['DISCIPLINE','Commercial architecture'],['PRESENTATION','Exterior visualization']] },
  ruban: { title: 'Ruban Residence', category: '03 / INTERIORS · LIVING & KITCHEN', images:[{src:'ruban-living-room.jpg',alt:'Ruban Residence living room with walnut media wall, neutral seating, and concealed warm lighting',caption:'Living room'}, {src:'ruban-kitchen.jpg',alt:'Ruban Residence walnut kitchen with a stone-look island, pendant lighting, and bar seating',caption:'Kitchen'}], copy:'A warm interior palette connects the living room and kitchen. Walnut-toned joinery, soft neutral surfaces, and carefully integrated lighting create continuity between spaces for relaxing, gathering, and cooking.', notes:[['PROJECT','Ruban Residence'],['DISCIPLINE','Interior design'],['SPACES','Living room & kitchen']] }
};
let activeProject = null;
let galleryIndex = 0;
function showGalleryImage(index) {
  if (!activeProject) return;
  const images = activeProject.images;
  galleryIndex = (index + images.length) % images.length;
  const selected = images[galleryIndex];
  $('#project-dialog-image').src = selected.src;
  $('#project-dialog-image').alt = selected.alt;
  $('#gallery-caption').textContent = `${selected.caption} · ${galleryIndex + 1} / ${images.length}`;
  $$('#gallery-thumbnails button').forEach((button,i) => button.setAttribute('aria-pressed',String(i === galleryIndex)));
}
$('#gallery-previous').addEventListener('click', () => showGalleryImage(galleryIndex - 1));
$('#gallery-next').addEventListener('click', () => showGalleryImage(galleryIndex + 1));
$('#project-dialog').addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); showGalleryImage(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let previousFocus;
function openDialog(dialog) {
  const open = $('dialog[open]');
  if (!open) previousFocus = document.activeElement;
  if (open) open.close();
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
}
$$('.project-card').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  $('#project-dialog-title').textContent = project.title;
  $('#project-dialog-category').textContent = project.category;
  $('#project-dialog-copy').textContent = project.copy;
  activeProject = project;
  const thumbnails = $('#gallery-thumbnails'); thumbnails.replaceChildren();
  const multiple = project.images.length > 1;
  thumbnails.hidden = !multiple;
  $('#gallery-previous').hidden = !multiple;
  $('#gallery-next').hidden = !multiple;
  if (multiple) project.images.forEach((image,index) => {
    const thumbnail = document.createElement('button'); thumbnail.type = 'button';
    thumbnail.setAttribute('aria-label', `Show ${image.caption.toLowerCase()}`);
    const img = document.createElement('img'); img.src = image.src; img.alt = '';
    thumbnail.append(img); thumbnail.addEventListener('click', () => showGalleryImage(index));
    thumbnails.append(thumbnail);
  });
  showGalleryImage(0);
  const notes = $('#project-dialog-notes'); notes.replaceChildren();
  project.notes.forEach(([label, text]) => {
    const item = document.createElement('div');
    const caption = document.createElement('span'); caption.className = 'mono'; caption.textContent = label;
    const content = document.createElement('p'); content.textContent = text;
    item.append(caption, content); notes.append(item);
  });
  openDialog($('#project-dialog'));
}));
$$('[data-open-enquiry]').forEach(button => button.addEventListener('click', () => openDialog($('#enquiry-dialog'))));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$$('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => {
    if (!$('dialog[open]')) { document.body.classList.remove('dialog-open'); previousFocus?.focus(); }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
});

let lastBrief = '';
const enquiryForm = $('#enquiry-form');
const invalidateBrief = event => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
  lastBrief = '';
  $('#form-status').hidden = true;
};
enquiryForm.addEventListener('input', invalidateBrief);
enquiryForm.addEventListener('change', invalidateBrief);
enquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const nameField = form.elements.namedItem('name');
  const messageField = form.elements.namedItem('message');
  nameField.setCustomValidity(nameField.value.trim() ? '' : 'Please enter your name.');
  messageField.setCustomValidity(messageField.value.trim() ? '' : 'Please tell us about your project.');
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  lastBrief = `Hello FR Design Studio,\n\nI would like to discuss a project with you.\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nService: ${data.service}\nProject location: ${data.location.trim() || 'To be discussed'}\n\nAbout my project:\n${data.message.trim()}\n\nBest regards,\n${data.name.trim()}`;
  const mailto = `mailto:frdesignstudioarchitect@gmail.com?subject=${encodeURIComponent(`Project enquiry — ${data.service}`)}&body=${encodeURIComponent(lastBrief)}`;
  $('#form-status').hidden = false;
  window.location.href = mailto;
});
$('#download-brief').addEventListener('click', () => {
  if (!lastBrief) return;
  const url = URL.createObjectURL(new Blob([lastBrief], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'FR-Design-Studio-project-brief.txt';
  document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
$('#year').textContent = String(new Date().getFullYear());
