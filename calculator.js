// Brand data
const brands = {
    tsSolar: {
        name: 'TS-SOLAR',
        models: {
            '2M X 0,30M': { area: 0.60, length: 2.0, width: 0.30, size: 'Pequeno' },
            '3M X 0,30M': { area: 0.90, length: 3.0, width: 0.30, size: 'Médio' },
            '3,70M X 0,30M': { area: 1.11, length: 3.7, width: 0.30, size: 'Médio' },
            '4M X 0,30M': { area: 1.20, length: 4.0, width: 0.30, size: 'Grande' },
            '5M X 0,30M': { area: 1.50, length: 5.0, width: 0.30, size: 'Grande' }
        }
    },
    komeco: {
        name: 'KOMECO',
        models: {
            'KOCS PS 2.0': { area: 2.4, length: 2.0, width: 1.2, size: 'Compacto' },
            'KOCS PS 3.0': { area: 3.6, length: 3.0, width: 1.2, size: 'Médio' },
            'KOCS PS 4.0': { area: 4.8, length: 4.0, width: 1.2, size: 'Grande' }
        }
    },
    solis: {
        name: 'SOLIS',
        litersPerCollector: 4000
    },
    mastersol: {
        name: 'MASTERSOL',
        models: {
            'MASTERSOL 2000': { area: 1.2, length: 2.0, width: 0.6, size: 'Compacto' },
            'MASTERSOL 3000': { area: 1.5, length: 3.0, width: 0.5, size: 'Standard' },
            'MASTERSOL 3700': { area: 1.8, length: 3.7, width: 0.5, size: 'Standard' },
            'MASTERSOL 4500': { area: 2.0, length: 4.5, width: 0.45, size: 'Grande' },
            'MASTERSOL 5000': { area: 2.5, length: 5.0, width: 0.5, size: 'Extra Grande' }
        }
    },
    girassol: {
        name: 'GIRASSOL',
        litersPerCollector: 4000
    },
    soria: {
        name: 'SORIA',
        models: {
            'URJA 200': { area: 0.64, length: 2.0, width: 0.32, size: 'Compacto' },
            'URJA 300': { area: 0.96, length: 3.0, width: 0.32, size: 'Standard' },
            'URJA 400': { area: 1.18, length: 4.0, width: 0.3, size: 'Grande' },
            'URJA 500': { area: 1.44, length: 5.0, width: 0.3, size: 'Extra Grande' },
            'URJA 5000': { area: 6.0, length: 5.0, width: 1.2, size: 'Industrial' }
        }
    },
    tempersol: {
        name: 'TEMPERSOL',
        models: {
            'POOL 200': { area: 1.0, length: 2.0, width: 0.5, size: 'Compacto' },
            'POOL 300': { area: 1.5, length: 3.0, width: 0.5, size: 'Standard' },
            'POOL 400': { area: 2.0, length: 4.0, width: 0.5, size: 'Grande' }
        }
    }
};

// DOM Elements
const formSteps = document.querySelectorAll('.form-step');
const whatsappButton = document.querySelector('.whatsapp-button');
const chatPanel = document.querySelector('.chat-panel');
const closeButton = document.querySelector('.close-button');
const whatsappForm = document.getElementById('whatsapp-form');
const phoneInput = document.getElementById('contact-phone');
const phoneError = document.getElementById('phone-error');
const nameInput = document.getElementById('contact-name');
const logoLink = document.getElementById('logo-link');
const footerContact = document.getElementById('footer-contact');

// Telegram Bot Functions
async function sendToTelegram(botToken, chatId, message) {
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        if (!response.ok) {
            console.error('Erro ao enviar para Telegram:', await response.text());
        }
    } catch (error) {
        console.error('Erro ao enviar para Telegram:', error);
    }
}

// Função para obter a localização aproximada via IP
async function getLocationFromIP() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        if (response.ok) {
            const data = await response.json();
            return {
                ip: data.ip,
                city: data.city,
                region: data.region,
                country: data.country_name,
                lat: data.latitude,
                lon: data.longitude
            };
        }
        return { ip: 'Desconhecido', location: 'Não foi possível determinar' };
    } catch (error) {
        return { ip: 'Erro', location: 'Erro ao obter localização' };
    }
}

// Função para formatar os dados do cálculo para o Telegram
async function formatCalculationData(formData, result) {
    const location = await getLocationFromIP();
    const brand = brands[formData.brand].name;
    
    let message = `<b>📊 Novo Cálculo de Coletores Solares</b>\n\n`;
    message += `🏷️ <b>Marca:</b> ${brand}\n`;
    message += `📏 <b>Dimensões da Piscina:</b> ${formData.length}m x ${formData.width}m\n`;
    message += `🌡️ <b>Temperatura Desejada:</b> ${document.getElementById('temperature').options[document.getElementById('temperature').selectedIndex].text}\n`;
    message += `🌍 <b>Região Climática:</b> ${document.getElementById('climate').options[document.getElementById('climate').selectedIndex].text}\n`;
    message += `🧭 <b>Orientação do Telhado:</b> ${document.getElementById('roofOrientation').options[document.getElementById('roofOrientation').selectedIndex].text}\n`;
    message += `🔥 <b>Aquecimento Extra:</b> ${formData.additionalHeating ? 'Sim (+30%)' : 'Não'}\n\n`;
    
    if (formData.checkRoofSize) {
        message += `🏠 <b>Dimensões do Telhado:</b> ${formData.roofWidth}m x ${formData.roofLength}m\n\n`;
    }
    
    // Adicionar resultados
    message += `<b>📈 Resultados:</b>\n`;
    message += `◾ Área da Piscina: ${result.baseArea.toFixed(2)}m²\n`;
    message += `◾ Volume: ${result.volumeInLiters.toFixed(0)} litros\n`;
    
    if (result.correctedArea !== result.baseArea) {
        message += `◾ Área Corrigida: ${result.correctedArea.toFixed(2)}m²\n`;
    }
    
    // Adicionar localização
    message += `\n<b>📍 Localização Aproximada:</b>\n`;
    message += `◾ IP: ${location.ip}\n`;
    message += `◾ Cidade: ${location.city || 'Desconhecida'}\n`;
    message += `◾ Região: ${location.region || 'Desconhecida'}\n`;
    message += `◾ País: ${location.country || 'Desconhecido'}\n`;
    
    if (location.lat && location.lon) {
        message += `◾ Mapa: https://www.google.com/maps?q=${location.lat},${location.lon}\n`;
    }
    
    return message;
}

// Função para enviar dados de contato do WhatsApp
async function sendContactToTelegram(name, phone) {
    const location = await getLocationFromIP();
    
    let message = `<b>📞 Novo Contato via WhatsApp</b>\n\n`;
    message += `👤 <b>Nome:</b> ${name}\n`;
    message += `📱 <b>Telefone:</b> ${phone}\n\n`;
    message += `<b>📍 Localização Aproximada:</b>\n`;
    message += `◾ IP: ${location.ip}\n`;
    message += `◾ Cidade: ${location.city || 'Desconhecida'}\n`;
    message += `◾ Região: ${location.region || 'Desconhecida'}\n`;
    message += `◾ País: ${location.country || 'Desconhecido'}\n`;
    
    if (location.lat && location.lon) {
        message += `◾ Mapa: https://www.google.com/maps?q=${location.lat},${location.lon}\n`;
    }
    
    // Substitua pelo token e chat ID do seu segundo bot do Telegram
    const contactBotToken = '7900706827:AAF4S_AbMd1mU4xqVhW4bKSwJ6AMmuMhaIc';
    const contactChatId = '5581669828';
    
    await sendToTelegram(contactBotToken, contactChatId, message);
}

// Form steps management
let currentStep = 1;

function updateFormSteps() {
    formSteps.forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        
        if (stepNumber <= currentStep) {
            // Etapas já completadas ou ativas (sem blur)
            step.classList.add('active');
            step.style.filter = 'none';
            step.style.opacity = '1';
        } else {
            // Apenas etapas futuras (com blur)
            step.classList.remove('active');
            step.style.filter = 'blur(2px)';
            step.style.opacity = '0.7';
        }
    });
}

// Initialize form steps
updateFormSteps();

// Handle brand selection
document.getElementById('brand').addEventListener('change', function() {
    if (this.value) {
        currentStep = Math.max(currentStep, 2);
        updateFormSteps();
    }
});

// Handle dimension inputs
['length', 'width'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        if (document.getElementById('length').value && document.getElementById('width').value) {
            currentStep = Math.max(currentStep, 3);
            updateFormSteps();
        }
    });
});

// Handle regional factors
['climate', 'temperature', 'roofOrientation'].forEach(id => {
    document.getElementById(id).addEventListener('change', function() {
        const climate = document.getElementById('climate').value;
        const temperature = document.getElementById('temperature').value;
        const orientation = document.getElementById('roofOrientation').value;
        
        if (climate && temperature && orientation) {
            currentStep = Math.max(currentStep, 4);
            updateFormSteps();
        }
    });
});

// Handle roof size checkbox
document.getElementById('checkRoofSize').addEventListener('change', function() {
    const roofDimensions = document.getElementById('roofDimensions');
    
    if (this.checked) {
        roofDimensions.style.display = 'block';
        setTimeout(() => {
            currentStep = Math.max(currentStep, 5);
            updateFormSteps();
        }, 10);
    } else {
        roofDimensions.style.display = 'none';
    }
});

// Show alert message with animation
function showAlert(message, type = 'error') {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
    
    setTimeout(() => {
        alert.style.opacity = '1';
    }, 10);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.style.display = 'none';
        }, 300);
    }, 5000);
}

// Format dimensions nicely
function formatDimensions(length, width, size) {
    return `${length.toFixed(2)} x ${width.toFixed(2)}m ${size ? `(${size})` : ''}`;
}

// Calculate collectors
function calculateCollectors(formData) {
    const {
        brand: selectedBrand,
        length,
        width,
        temperature,
        climate,
        roofOrientation,
        additionalHeating,
        checkRoofSize,
        roofWidth,
        roofLength
    } = formData;

    // Calculate base and corrected area
    let baseArea = length * width;
    const volumeInLiters = baseArea * 1000;

    // Apply additional heating if selected
    let correctedArea = additionalHeating ? baseArea * 1.3 : baseArea;

    // Apply correction factors
    correctedArea = correctedArea * temperature * climate * roofOrientation;

    const brand = brands[selectedBrand];
    const result = {
        baseArea,
        correctedArea,
        modelResults: [],
        volumeInLiters
    };

    if (brand.models) {
        // For brands with multiple models
        for (const [model, specs] of Object.entries(brand.models)) {
            const collectors = Math.ceil(correctedArea / specs.area);
            const batteries = Math.ceil(collectors / 20);
            
            const modelResult = {
                model,
                collectors,
                area: specs.area,
                dimensions: formatDimensions(specs.length, specs.width, specs.size),
                batteries
            };

            // Roof size check
            if (checkRoofSize && roofWidth && roofLength) {
                const usableWidth = roofWidth - 0.5;  // Allow for 0.5m margin
                const usableLength = roofLength - 0.5;  // Allow for 0.5m margin
                
                const maxPerRow = Math.floor(usableLength / specs.length);
                const maxRows = Math.floor(usableWidth / specs.width);
                const maxPossible = maxPerRow * maxRows;
                
                modelResult.roofCheck = {
                    maxPerRow,
                    maxRows,
                    maxPossible,
                    fits: maxPossible >= collectors
                };
            }

            result.modelResults.push(modelResult);
        }
    } else if (brand.litersPerCollector) {
        // For brands based on liters per collector
        const collectors = Math.ceil(volumeInLiters / brand.litersPerCollector);
        const batteries = Math.ceil(collectors / 20);
        
        result.collectors = collectors;
        result.batteries = batteries;
        result.litersPerCollector = brand.litersPerCollector;
    }

    return result;
}

// Display results with animation
function displayResults(result, selectedBrand, formData) {
    const resultsDiv = document.getElementById('results');
    const brand = brands[selectedBrand];
    const shouldCheckRoof = result.modelResults && result.modelResults[0]?.roofCheck !== undefined;
    const hasFittingModels = shouldCheckRoof ? 
        result.modelResults.some(model => model.roofCheck?.fits) : 
        true;

    let html = `
        <h3 class="result-title">${brand.name}</h3>
        <div class="results-grid">
            <div class="result-card summary-card">
                ${result.baseArea ? `<div class="summary-item">
                    <span class="summary-label">Área:</span>
                    <span class="summary-value">${result.baseArea.toFixed(2)}m²</span>
                </div>` : ''}
                ${result.volumeInLiters ? `<div class="summary-item">
                    <span class="summary-label">Volume:</span>
                    <span class="summary-value">${result.volumeInLiters.toFixed(0)} litros</span>
                </div>` : ''}
                ${result.correctedArea && result.correctedArea !== result.baseArea ? `
                <div class="summary-item">
                    <span class="summary-label">Área corrigida:</span>
                    <span class="summary-value">${result.correctedArea.toFixed(2)}m²</span>
                </div>` : ''}
            </div>`;

    // Função para renderizar modelos de qualquer marca
    const renderModels = (brandData, models) => {
        let sectionHtml = '';
        
        if (brandData.models) {
            sectionHtml += `<div class="models-container">`;
            models.forEach(modelResult => {
                const isInvalid = shouldCheckRoof && modelResult.roofCheck && !modelResult.roofCheck.fits;
                
                sectionHtml += `
                    <div class="model-card ${isInvalid ? 'invalid' : ''}">
                        <h4>${modelResult.model}</h4>
                        <div class="model-specs">${modelResult.dimensions}</div>
                        <div class="model-stats">
                            <div class="stat-item">
                                <span>Coletores:</span>
                                <strong>${modelResult.collectors}</strong>
                            </div>
                            <div class="stat-item">
                                <span>Baterias:</span>
                                <strong>${modelResult.batteries}</strong>
                            </div>
                        </div>
                        ${modelResult.roofCheck ? `
                        <div class="roof-check ${modelResult.roofCheck.fits ? 'success' : 'error'}">
                            <div class="check-item">
                                <span>Cabem:</span>
                                <strong>${modelResult.roofCheck.maxPossible}</strong>
                            </div>
                            <div class="check-icon">
                                ${modelResult.roofCheck.fits ? '✓' : '✗'}
                            </div>
                        </div>` : ''}
                    </div>`;
            });
            sectionHtml += `</div>`;
        } else {
            // Para marcas baseadas em litros
            sectionHtml += `
                <div class="model-card single-model">
                    <div class="model-stats">
                        <div class="stat-item">
                            <span>Coletores:</span>
                            <strong>${result.collectors}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Baterias:</span>
                            <strong>${result.batteries}</strong>
                        </div>
                    </div>
                    <p class="model-specs">${brandData.litersPerCollector} litros por coletor</p>
                </div>`;
        }
        
        return sectionHtml;
    };

    // Renderiza os modelos da marca selecionada
    if (brand.models) {
        const modelsToShow = (shouldCheckRoof && hasFittingModels) ? 
            result.modelResults.filter(model => model.roofCheck?.fits) : 
            result.modelResults;
        
        html += renderModels(brand, modelsToShow);
    } else {
        html += renderModels(brand, []);
    }

    // Verifica outras marcas se necessário
    let alternativeBrandsHtml = '';
    let anyAlternativeFits = false;

    if (shouldCheckRoof && !hasFittingModels) {
        // Verifica todas as outras marcas
        Object.entries(brands).forEach(([brandKey, brandData]) => {
            if (brandKey !== selectedBrand && brandData.models) {
                // Cria um novo formData para a marca alternativa
                const altFormData = {
                    ...formData,
                    brand: brandKey
                };
                
                // Simula o cálculo para esta marca
                const tempResult = calculateCollectors(altFormData);

                const fits = tempResult.modelResults.some(m => m.roofCheck?.fits);
                if (fits) anyAlternativeFits = true;

                alternativeBrandsHtml += `
                    <div class="alternative-brand ${fits ? 'has-solution' : ''}">
                        <h4>${brandData.name}</h4>
                        ${fits ? `
                        <div class="alternative-models">
                            ${tempResult.modelResults
                                .filter(m => m.roofCheck?.fits)
                                .map(m => `
                                    <div class="alternative-model">
                                        <span>${m.model}</span>
                                        <span>${m.dimensions}</span>
                                        <span>${m.collectors} coletores</span>
                                    </div>`
                                ).join('')}
                        </div>
                        <button class="button button-small" onclick="recalculateWithBrand('${brandKey}')">
                            Calcular com ${brandData.name}
                        </button>
                        ` : `
                        <div class="no-solution">Nenhum modelo adequado</div>
                        `}
                    </div>`;
            }
        });

        if (alternativeBrandsHtml) {
            html += `
                <div class="alternatives-section">
                    <h3 class="alternatives-title">${anyAlternativeFits ? '🚀 Alternativas Disponíveis' : '⚠️ Análise de Outras Marcas'}</h3>
                    <div class="alternatives-grid">
                        ${alternativeBrandsHtml}
                    </div>
                    ${!anyAlternativeFits ? `
                    <div class="no-alternatives-warning">
                        <p>Tentei calcular com todas as marcas registradas, mas nenhuma delas pode atender às dimensões do seu telhado.</p>
                        <p>Por favor, considere:</p>
                        <ul>
                            <li>Reduzir o número de coletores necessários</li>
                            <li>Reavaliar as dimensões do telhado</li>
                            <li>Consultar um especialista para soluções personalizadas</li>
                        </ul>
                    </div>` : ''}
                </div>`;
        }
    }

    html += `</div>`; // Fecha results-grid
    
    resultsDiv.innerHTML = html;
    resultsDiv.style.display = 'block';
    setTimeout(() => {
        resultsDiv.style.opacity = '1';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 10);
}

// Função para recalculcar com outra marca
function recalculateWithBrand(brandKey) {
    document.getElementById('brand').value = brandKey;
    
    // Dispara o evento de change para atualizar os steps
    document.getElementById('brand').dispatchEvent(new Event('change'));
    
    // Dispara o submit
    document.getElementById('calculatorForm').dispatchEvent(new Event('submit'));
}

// Handle form submission
document.getElementById('calculatorForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        brand: document.getElementById('brand').value,
        length: parseFloat(document.getElementById('length').value),
        width: parseFloat(document.getElementById('width').value),
        temperature: parseFloat(document.getElementById('temperature').value),
        climate: parseFloat(document.getElementById('climate').value),
        roofOrientation: parseFloat(document.getElementById('roofOrientation').value),
        additionalHeating: document.getElementById('additionalHeating').checked,
        checkRoofSize: document.getElementById('checkRoofSize').checked,
        roofWidth: document.getElementById('roofWidth').value ? parseFloat(document.getElementById('roofWidth').value) : 0,
        roofLength: document.getElementById('roofLength').value ? parseFloat(document.getElementById('roofLength').value) : 0
    };

    // Validação
    if (!formData.brand) {
        showAlert('Por favor, selecione uma marca de coletor.');
        return;
    }

    if (!formData.length || !formData.width) {
        showAlert('Por favor, preencha as dimensões da piscina.');
        return;
    }

    if (formData.checkRoofSize && (!formData.roofWidth || !formData.roofLength)) {
        showAlert('Por favor, preencha as dimensões do telhado.');
        return;
    }

    const result = calculateCollectors(formData);
    displayResults(result, formData.brand, formData); // Passa formData como terceiro parâmetro
    
    // Enviar dados para o Telegram (bot de cálculos)
    try {
        const calculationMessage = await formatCalculationData(formData, result);
        const calculationBotToken = '7142106136:AAGI2c-leCokKSedPmJDEqPddJ1bshsPfgM';
        const calculationChatId = '5581669828';
        await sendToTelegram(calculationBotToken, calculationChatId, calculationMessage);
    } catch (error) {
        console.error('Erro ao enviar cálculo para Telegram:', error);
    }
});

// Handle reset button
document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('calculatorForm').reset();
    
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.opacity = '0';
    
    setTimeout(() => {
        resultsDiv.style.display = 'none';
        this.style.display = 'none';
        currentStep = 1;
        updateFormSteps();
        document.getElementById('roofDimensions').style.display = 'none';
    }, 300);
    
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// WhatsApp Widget Functionality
function toggleChatPanel() {
    chatPanel.classList.toggle('open');
}

whatsappButton.addEventListener('click', toggleChatPanel);
closeButton.addEventListener('click', toggleChatPanel);

// Validate phone number
function validatePhoneNumber(phone) {
    // Validate 10-11 digit numbers (DDD + number)
    const regex = /^(\d{10,11})$/;
    return regex.test(phone);
}

// Handle WhatsApp form submission
whatsappForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const phone = phoneInput.value.trim();
    const name = nameInput.value.trim();
    
    if (!name) {
        phoneError.textContent = "Por favor, informe seu nome";
        phoneError.classList.add('show');
        return;
    }
    
    if (!phone || !validatePhoneNumber(phone)) {
        phoneError.textContent = "Informe um número válido (ex: 43912345678)";
        phoneError.classList.add('show');
        return;
    }
    
    // Enviar dados de contato para o Telegram (segundo bot)
    try {
        await sendContactToTelegram(name, phone);
    } catch (error) {
        console.error('Erro ao enviar contato para Telegram:', error);
    }
    
    // Format WhatsApp message with location info
    const location = await getLocationFromIP();
    let whatsappMsg = `Olá eu sou ${name} e gostaria de saber mais sobre o aquecimento de piscinas.\n\n`;
   
    // Open WhatsApp with the message
    window.open(`https://wa.me/5543996349824?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    
    // Reset and close form
    this.reset();
    toggleChatPanel();
});

// Clean phone input to only allow numbers
phoneInput.addEventListener('input', function() {
    phoneError.classList.remove('show');
    this.value = this.value.replace(/\D/g, ''); // Remove non-digit characters
});

// Logo and footer links
logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://qg-digital.github.io/instuticional/', '_blank');
});

footerContact.addEventListener('click', function(e) {
    e.preventDefault();
    window.open('https://wa.me/5543996349824?text=Olá gostaria de falar com o desenvolvedor', '_blank');
});

// Add page load animations
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay for a smoother loading experience
    setTimeout(() => {
        const calculatorCard = document.querySelector('.calculator-card');
        calculatorCard.style.opacity = '0';
        calculatorCard.style.display = 'block';
        calculatorCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            calculatorCard.style.opacity = '1';
            calculatorCard.style.transform = 'translateY(0)';
        }, 50);
        
        // Delayed animation for WhatsApp button
        setTimeout(() => {
            const whatsappWidget = document.querySelector('.whatsapp-widget');
            whatsappWidget.style.opacity = '0';
            whatsappWidget.style.display = 'block';
            
            setTimeout(() => {
                whatsappWidget.style.opacity = '1';
            }, 50);
        }, 800);
    }, 100);
});