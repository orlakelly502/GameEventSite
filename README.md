[README.md](https://github.com/user-attachments/files/25796116/README.md)
# COM109 - Client Side Development
## Group Coursework 2

**Module:** COM109 Client Side Development  
**Year:** 2025/26  
**University:** Ulster University  

---

## Project Overview
A contemporary and accessible website built using HTML, CSS, JavaScript

---

## Pages
| Page | File | Description |
|---|---|---|
| Image/Map Page | index.html | Main landing page with background image and CSS styling |
| Information Page | info.html | Interactive content revealed through jQuery animation |
| Form Page | form.html | Contact form with JavaScript and jQuery validation |

---

## Folder Structure
```
COM109-Group-Project/
  index.html          
  info.html           
  form.html           
  css/
    styles.css        
  js/
    script.js         
  images/
    background.jpg    
    favicon.ico       
  README.md
```

---

## Technology Stack
- HTML5
- CSS3
- JavaScript
- jQuery
- Bootstrap 5

---

## Getting Started
1. Clone the repository
2. Open any html file in Chrome
3. No additional installs required — Bootstrap and jQuery loaded via CDN

---

## Bootstrap and jQuery Setup

Add to `<head>` of every HTML page:
```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Custom CSS after Bootstrap -->
<link rel="stylesheet" href="css/styles.css">
```

Add before closing `</body>` tag on every page:
```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Custom JS -->
<script src="js/script.js"></script>
```

---

## Group To Do List

### Setup
- [ ] GitHub repo created and set to private
- [ ] All group members added as collaborators
- [ ] Decide what the website will be about
- [ ] Folder structure created
- [ ] Bootstrap linked in all pages
- [ ] jQuery linked in all pages
- [ ] Shared styles.css linked in all pages
- [ ] Background image added to images folder
- [ ] Favicon added to images folder
- [ ] Navigation linking all pages added to all pages

---

### Image/Map Page (index.html)
- [ ] Background image applied via CSS
- [ ] Content displayed with custom CSS styling
- [ ] CSS classes and IDs named appropriately
- [ ] CSS transitions or hover effects added
- [ ] User friendly layout

---

### Information Page (info.html)
- [ ] Content hidden on page load
- [ ] jQuery used to reveal content on click
- [ ] Each click reveals next piece of information
- [ ] Smooth animation on reveal
- [ ] User friendly experience

---

### Form Page (form.html)
- [ ] Input fields — name, email, message minimum
- [ ] Labels on every input
- [ ] JavaScript validation — empty field checks
- [ ] Email format validation
- [ ] Error messages shown on page not alerts
- [ ] Success message on valid submission
- [ ] ARIA attributes on error messages

---

### CSS (styles.css)
- [ ] External CSS only — no inline styles
- [ ] No duplicate rules
- [ ] Consistent styling across all pages
- [ ] CSS transitions included

---

### Accessibility
- [ ] Semantic HTML used across all pages (header, nav, main, footer)
- [ ] All images have alt text
- [ ] All form inputs have labels
- [ ] Colour contrast checked via WebAIM
- [ ] Skip navigation link added
- [ ] Keyboard navigation tested
- [ ] ARIA attributes added to dynamic content
- [ ] Focus management on dynamic content
- [ ] Google Lighthouse run and issues fixed
- [ ] WAVE accessibility checker run
- [ ] W3C validator run on all pages

---

### Individual Reports (Everyone)
- [ ] 1800 words per person
- [ ] Screenshots of work included
- [ ] W3C validation report included
- [ ] Lighthouse score screenshot included
- [ ] Design decisions explained
- [ ] Personal reflection included
- [ ] File named correctly — GroupID_SurnameFirstNameBNumber

---

### Submission
- [ ] All files in correct folders
- [ ] Code zipped correctly
- [ ] PDF report ready
- [ ] Submitted via Blackboard by 23 April 2026 noon

---

## Useful Links
- [W3C Validator](https://validator.w3.org)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker)
- [WAVE Accessibility Checker](https://wave.webaim.org)
- [Bootstrap Docs](https://getbootstrap.com)
- [jQuery Docs](https://jquery.com)
- [W3Schools](https://w3schools.com)
- [Video on Bootstrap Grid System](https://www.youtube.com/watch?v=-jnCgrR_yKg&t=311s)
