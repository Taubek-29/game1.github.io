document.addEventListener("DOMContentLoaded", function() {
    const portfolioData = JSON.parse(localStorage.getItem("portfolioData"));
    if (!portfolioData) {
        window.location.href = "index.html";
        return;
    }

    const slides = document.querySelectorAll(".slide");
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    const prevBtn = document.getElementById("prev-slide");
    const nextBtn = document.getElementById("next-slide");
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    
    const themeOptions = document.querySelectorAll(".theme-option");
    const fontSizeSelect = document.getElementById("font-size");
    const headingColor = document.getElementById("heading-color");
    const exportPdfBtn = document.getElementById("export-pdf");
    const exportImageBtn = document.getElementById("export-image");
    
    function loadPortfolioData() {
        document.getElementById("welcome-text").textContent = 
            `Привет, меня зовут ${portfolioData.name} и я ${portfolioData.job}`;
        
        document.getElementById("about-content").innerHTML = 
            `<p>${portfolioData.about}</p>`;
        
        const skillsContainer = document.getElementById("skills-container");
        skillsContainer.innerHTML = "";
        portfolioData.skills.forEach(skill => {
            if (skill.trim()) {
                const skillElement = document.createElement("div");
                skillElement.className = "skill-tag";
                skillElement.textContent = skill;
                skillsContainer.appendChild(skillElement);
            }
        });
        
        const projectsContainer = document.getElementById("projects-container");
        projectsContainer.innerHTML = "";
        portfolioData.projects.forEach(project => {
            if (project.trim()) {
                const projectElement = document.createElement("div");
                projectElement.className = "project-card";
                projectElement.innerHTML = `
                    <h3 class="project-title">${project}</h3>
                    <p class="project-description">Здесь может быть описание проекта</p>
                `;
                projectsContainer.appendChild(projectElement);
            }
        });
        
        const certificatesContainer = document.getElementById("certificates-container");
        certificatesContainer.innerHTML = "";
        if (portfolioData.certificates && portfolioData.certificates.length > 0) {
            portfolioData.certificates.forEach(cert => {
                if (cert.trim()) {
                    const certElement = document.createElement("div");
                    certElement.className = "project-card";
                    certElement.innerHTML = `
                        <h3 class="project-title">${cert}</h3>
                        <p class="project-description">Получен в 2023 году</p>
                    `;
                    certificatesContainer.appendChild(certElement);
                }
            });
        } else {
            certificatesContainer.innerHTML = "<p>Сертификаты не указаны</p>";
        }
        
        const contactsContainer = document.getElementById("contacts-container");
        contactsContainer.innerHTML = "";
        
        if (portfolioData.email) {
            const emailItem = document.createElement("div");
            emailItem.className = "contact-item";
            emailItem.innerHTML = `
                <div class="contact-icon">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="contact-text">${portfolioData.email}</div>
            `;
            contactsContainer.appendChild(emailItem);
        }
        
        if (portfolioData.phone) {
            const phoneItem = document.createElement("div");
            phoneItem.className = "contact-item";
            phoneItem.innerHTML = `
                <div class="contact-icon">
                    <i class="fas fa-phone"></i>
                </div>
                <div class="contact-text">${portfolioData.phone}</div>
            `;
            contactsContainer.appendChild(phoneItem);
        }
        
        if (portfolioData.social && portfolioData.social.length > 0) {
            portfolioData.social.forEach(socialLink => {
                if (socialLink.trim()) {
                    const socialItem = document.createElement("div");
                    socialItem.className = "contact-item";
                    socialItem.innerHTML = `
                        <div class="contact-icon">
                            <i class="fab fa-telegram"></i>
                        </div>
                        <div class="contact-text">
                            <a href="${socialLink}" target="_blank">${socialLink}</a>
                        </div>
                    `;
                    contactsContainer.appendChild(socialItem);
                }
            });
        }
        
        applyTheme(portfolioData.theme);
    }
    
    function showSlide(index, direction = "next") {
        slides.forEach(slide => {
            slide.classList.remove("active", "slide-next", "slide-prev");
        });
        
        slides[index].classList.add("active");
        slides[index].classList.add(direction === "next" ? "slide-next" : "slide-prev");
        
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalSlides - 1;
    }
    
    function applyTheme(theme) {
        const portfolioTheme = document.getElementById("portfolio-theme");
        
        portfolioTheme.classList.remove(
            "theme-minimal",
            "theme-creative",
            "theme-tech"
        );
        
        portfolioTheme.classList.add(`theme-${theme}`);
        
        themeOptions.forEach(option => {
            option.classList.remove("active");
            if (option.dataset.theme === theme) {
                option.classList.add("active");
            }
        });
    }
    
    function goToNextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide, "next");
        }
    }
    
    function goToPrevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide, "prev");
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Ошибка при переходе в полноэкранный режим: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
    
    function exportToPdf() {
        const element = document.getElementById("portfolio-theme");
        const opt = {
            margin: 10,
            filename: `${portfolioData.name}_portfolio.pdf`,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };
        
        const controls = document.querySelector(".controls");
        const editorPanel = document.querySelector(".editor-panel");
        controls.style.display = "none";
        editorPanel.style.display = "none";
        
        html2pdf().from(element).set(opt).save().then(() => {
            controls.style.display = "";
            editorPanel.style.display = "";
        });
    }
    
    function initEvents() {
        nextBtn.addEventListener("click", goToNextSlide);
        prevBtn.addEventListener("click", goToPrevSlide);
        
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") {
                goToNextSlide();
            } else if (e.key === "ArrowLeft") {
                goToPrevSlide();
            } else if (e.key === "Escape" && document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
        
        fullscreenBtn.addEventListener("click", toggleFullscreen);
        
        themeOptions.forEach(option => {
            option.addEventListener("click", function() {
                const theme = this.dataset.theme;
                applyTheme(theme);
            });
        });
        
        fontSizeSelect.addEventListener("change", function() {
            document.documentElement.style.fontSize = this.value;
        });
        
        headingColor.addEventListener("input", function() {
            document.documentElement.style.setProperty("--primary", this.value);
        });
        
        exportPdfBtn.addEventListener("click", exportToPdf);
        exportImageBtn.addEventListener("click", () => {
            alert("Функция экспорта в изображение будет реализована в следующей версии");
        });
    }
    
    loadPortfolioData();
    showSlide(currentSlide);
    initEvents();
});