document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cardForm = document.getElementById('card-form');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    
    // Preview Elements
    const previewName = document.getElementById('preview-name');
    const previewTitle = document.getElementById('preview-title');
    const previewCompany = document.getElementById('preview-company');
    const previewEmail = document.getElementById('preview-email');
    const previewPhone = document.getElementById('preview-phone');
    const previewWebsite = document.getElementById('preview-website');
    const previewLinkedin = document.getElementById('preview-linkedin');
    const previewTwitter = document.getElementById('preview-twitter');
    const previewGithub = document.getElementById('preview-github');
    const previewInstagram = document.getElementById('preview-instagram');
    const previewFacebook = document.getElementById('preview-facebook');
    const previewCard = document.querySelector('.preview-card');
    const qrcodeContainer = document.getElementById('qrcode');
    
    // Form Elements
    const fullNameInput = document.getElementById('fullName');
    const jobTitleInput = document.getElementById('jobTitle');
    const companyInput = document.getElementById('company');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const websiteInput = document.getElementById('website');
    const linkedinInput = document.getElementById('linkedin');
    const twitterInput = document.getElementById('twitter');
    const githubInput = document.getElementById('github');
    const instagramInput = document.getElementById('instagram');
    const facebookInput = document.getElementById('facebook');
    const cardColorInput = document.getElementById('cardColor');
    const textColorInput = document.getElementById('textColor');
    const cardLayoutInput = document.getElementById('cardLayout');
    
    // Card data object
    let cardData = {
        fullName: 'Your Name',
        jobTitle: 'Your Title',
        company: 'Your Company',
        email: 'email@example.com',
        phone: '(123) 456-7890',
        website: 'website.com',
        linkedin: '#',
        twitter: '#',
        github: '#',
        instagram: '#',
        facebook: '#',
        cardColor: '#ffffff',
        textColor: '#000000',
        cardLayout: 'standard'
    };
    
    // Initialize QR code
    let qrcode = null;
    
    // Real-time preview updates
    function updatePreview() {
        previewName.textContent = cardData.fullName;
        previewTitle.textContent = cardData.jobTitle;
        previewCompany.textContent = cardData.company;
        
        previewEmail.innerHTML = `<i class="fas fa-envelope"></i> ${cardData.email}`;
        previewPhone.innerHTML = `<i class="fas fa-phone"></i> ${cardData.phone}`;
        previewWebsite.innerHTML = `<i class="fas fa-globe"></i> ${cardData.website}`;
        
        previewLinkedin.href = cardData.linkedin;
        previewTwitter.href = cardData.twitter;
        previewInstagram.href = cardData.instagram;
        previewFacebook.href = cardData.facebook;
        previewGithub.href = cardData.github;
        
        // Update card styling
        previewCard.style.backgroundColor = cardData.cardColor;
        previewCard.style.color = cardData.textColor;
        
        // Update layout
        updateCardLayout(cardData.cardLayout);
    }
    
    // Update card layout based on selection
    function updateCardLayout(layout) {
        previewCard.className = 'preview-card';
        previewCard.classList.add(`layout-${layout}`);
        
        switch(layout) {
            case 'modern':
                previewCard.style.borderRadius = '16px';
                previewCard.style.padding = '40px 30px';
                break;
            case 'minimal':
                previewCard.style.boxShadow = 'none';
                previewCard.style.border = '1px solid #eee';
                previewCard.style.padding = '25px';
                break;
            default: // standard
                previewCard.style.borderRadius = '8px';
                previewCard.style.padding = '30px';
                previewCard.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Generate QR code
    function generateQRCode() {
        // Clear previous QR code
        qrcodeContainer.innerHTML = '';
        
        // Create vCard format
        const vCardData = [
            'BEGIN:VCARD',
            'VERSION:3.0',
            `FN:${cardData.fullName}`,
            `TITLE:${cardData.jobTitle}`,
            `ORG:${cardData.company}`,
            `EMAIL:${cardData.email}`,
            `TEL:${cardData.phone}`,
            `URL:${cardData.website}`,
            'END:VCARD'
        ].join('\n');
        
        // Generate QR code
        qrcode = qrcode_generate(0, 'M');
        qrcode.addData(vCardData);
        qrcode.make();
        
        // Create QR code image
        const qrImage = qrcode.createImgTag(5);
        qrcodeContainer.innerHTML = qrImage;
        
        // Enable download and copy buttons
        downloadBtn.disabled = false;
        copyLinkBtn.disabled = false;
    }
    
    // Function to generate a unique link for the card
    function generateCardLink() {
        const cardDataEncoded = encodeURIComponent(JSON.stringify(cardData));
        return `${window.location.origin}${window.location.pathname}?card=${cardDataEncoded}`;
    }
    
    // Function to download card as image
    function downloadCard() {
        // Create a temporary container to hold the card for conversion
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '-9999px';
        
        // Clone the preview card
        const cardClone = previewCard.cloneNode(true);
        tempContainer.appendChild(cardClone);
        document.body.appendChild(tempContainer);
        
        // Use html2canvas to convert the card to an image
        html2canvas(cardClone).then(canvas => {
            // Create download link
            const link = document.createElement('a');
            link.download = `${cardData.fullName.replace(/\s+/g, '_')}_business_card.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // Clean up
            document.body.removeChild(tempContainer);
        }).catch(err => {
            console.error('Error generating image:', err);
            alert('There was an error generating your card image. Please try again.');
        });
    }
    
    // Function to copy card link to clipboard
    function copyCardLink() {
        const cardLink = generateCardLink();
        
        // Create a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = cardLink;
        document.body.appendChild(tempInput);
        
        // Select and copy the link
        tempInput.select();
        document.execCommand('copy');
        
        // Clean up
        document.body.removeChild(tempInput);
        
        // Provide feedback
        const originalText = copyLinkBtn.textContent;
        copyLinkBtn.textContent = 'Link Copied!';
        setTimeout(() => {
            copyLinkBtn.textContent = originalText;
        }, 2000);
    }
    
    // Check for card data in URL and load it
    function loadCardFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const cardParam = urlParams.get('card');
        
        if (cardParam) {
            try {
                const loadedCardData = JSON.parse(decodeURIComponent(cardParam));
                cardData = { ...cardData, ...loadedCardData };
                
                // Update form inputs
                fullNameInput.value = cardData.fullName;
                jobTitleInput.value = cardData.jobTitle;
                companyInput.value = cardData.company;
                emailInput.value = cardData.email;
                phoneInput.value = cardData.phone;
                websiteInput.value = cardData.website;
                linkedinInput.value = cardData.linkedin;
                twitterInput.value = cardData.twitter;
                githubInput.value = cardData.github;
                instagramInput.value = cardData.instagram;
                facebookInput.value = cardData.facebook;
                cardColorInput.value = cardData.cardColor;
                textColorInput.value = cardData.textColor;
                cardLayoutInput.value = cardData.cardLayout;
                
                // Update preview
                updatePreview();
                
                // Generate QR code
                generateQRCode();
            } catch (error) {
                console.error('Error loading card data from URL:', error);
            }
        }
    }
    
    // Event listeners for form inputs
    fullNameInput.addEventListener('input', function() {
        cardData.fullName = this.value || 'Your Name';
        updatePreview();
    });
    
    jobTitleInput.addEventListener('input', function() {
        cardData.jobTitle = this.value || 'Your Title';
        updatePreview();
    });
    
    companyInput.addEventListener('input', function() {
        cardData.company = this.value || 'Your Company';
        updatePreview();
    });
    
    emailInput.addEventListener('input', function() {
        cardData.email = this.value || 'email@example.com';
        updatePreview();
    });
    
    phoneInput.addEventListener('input', function() {
        cardData.phone = this.value || '(123) 456-7890';
        updatePreview();
    });
    
    websiteInput.addEventListener('input', function() {
        cardData.website = this.value || 'website.com';
        updatePreview();
    });
    
    linkedinInput.addEventListener('input', function() {
        cardData.linkedin = this.value || '#';
        updatePreview();
    });
    
    instagramInput.addEventListener('input', function() {
        cardData.instagram = this.value || '#';
        updatePreview();
    });
    
    facebookInput.addEventListener('input', function() {
        cardData.facebook = this.value || '#';
        updatePreview();
    });
    
    twitterInput.addEventListener('input', function() {
        cardData.twitter = this.value || '#';
        updatePreview();
    });
    
    githubInput.addEventListener('input', function() {
        cardData.github = this.value || '#';
        updatePreview();
    });
    
    cardColorInput.addEventListener('input', function() {
        cardData.cardColor = this.value;
        updatePreview();
    });
    
    textColorInput.addEventListener('input', function() {
        cardData.textColor = this.value;
        updatePreview();
    });
    
    cardLayoutInput.addEventListener('change', function() {
        cardData.cardLayout = this.value;
        updatePreview();
    });
    
    // Generate button event listener
    generateBtn.addEventListener('click', function() {
        if (!fullNameInput.value) {
            alert('Please enter at least your full name to generate a card.');
            return;
        }
        
        generateQRCode();
    });
    
    // Download button event listener
    downloadBtn.addEventListener('click', function() {
        if (this.disabled) return;
        
        // Load html2canvas dynamically
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
            script.onload = downloadCard;
            document.head.appendChild(script);
        } else {
            downloadCard();
        }
    });
    
    // Copy link button event listener
    copyLinkBtn.addEventListener('click', function() {
        if (this.disabled) return;
        copyCardLink();
    });
    
    // Initialize
    updatePreview();
    loadCardFromURL();
    
    // QR Code Generator function (using qrcode-generator library)
    function qrcode_generate(typeNumber, errorCorrectionLevel) {
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        return qr;
    }

    // Card animation
    const cardAnimationContainer = document.querySelector('.card-animation-container');

    generateBtn.addEventListener('click', function() {
        if (!fullNameInput.value) {
            alert('Please enter at least your full name to generate a card.');
            return;
        }

        generateQRCode();

        // Add active class to start animation
        console.log('Animation triggered');
        cardAnimationContainer.classList.add('active');

        // Remove active class after animation
        console.log('Removing active class');
        setTimeout(() => {
            cardAnimationContainer.classList.remove('active');
        }, 500); // Adjust time to match CSS transition duration
    });
});
