document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('fileInput');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const encodeButton = document.getElementById('encodeSSTV');
    const decodeButton = document.getElementById('decodeSSTV');
    const transmitButton = document.createElement('button');
    
    transmitButton.textContent = 'Transmit';
    transmitButton.id = 'transmitSSTV';
    transmitButton.style.display = 'none';
    document.querySelector('.container').appendChild(transmitButton);

    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = 50;
    smallCanvas.height = 50;
    const smallCtx = smallCanvas.getContext('2d');

    const HEADER_BINARY = '011000010110111001110011011011110110111001110011011100110111010001110110';
    const TONE_FREQUENCY_HIGH = 1000;
    const TONE_FREQUENCY_LOW = 440;
    const TONE_DURATION = 20;

    let imageMatrix = '';

    encodeButton.addEventListener('click', () => {
        dropArea.style.display = 'block';
        transmitButton.style.display = 'none';
    });

    decodeButton.addEventListener('click', () => {
        dropArea.style.display = 'none';
        transmitButton.style.display = 'none';
    });

    transmitButton.addEventListener('click', () => {
        transmitHeader();
    });

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });

    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#3c3c3c';
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = '#2c2c2c';
    });

    dropArea.addEventListener('drop', (event) => {
        event.preventDefault();
        dropArea.style.backgroundColor = '#2c2c2c';
        handleFile(event.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', () => {
        handleFile(fileInput.files[0]);
    });

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    smallCtx.drawImage(img, 0, 0, smallCanvas.width, smallCanvas.height);
                    ctx.drawImage(smallCanvas, 0, 0, canvas.width, canvas.height);
                    convertImageToMatrix();
                    transmitButton.style.display = 'block';
                };
                img.src = e.target.result;
                dropArea.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    function convertImageToMatrix() {
        const imageData = smallCtx.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
        const { data } = imageData;
        let matrix = '';
        for (let y = 0; y < smallCanvas.height; y++) {
            let row = '';
            for (let x = 0; x < smallCanvas.width; x++) {
                const index = (y * smallCanvas.width + x) * 4;
                const r = data[index];
                const g = data[index + 1];
                const b = data[index + 2];
                row += `${padZero(r)}${padZero(g)}${padZero(b)}`;
                if (x < smallCanvas.width - 1) row += ',';
            }
            matrix += row + '\n';
        }
        imageMatrix = matrix.trim();
        console.log('Converted Matrix:\n', imageMatrix);
    }

    function padZero(value) {
        return value.toString().padStart(3, '0');
    }

    function transmitHeader() {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioCtx.sampleRate;
        const headerBuffer = audioCtx.createBuffer(1, sampleRate * HEADER_BINARY.length * TONE_DURATION / 1000, sampleRate);
        const data = headerBuffer.getChannelData(0);

        let offset = 0;
        HEADER_BINARY.split('').forEach(bit => {
            const duration = sampleRate * TONE_DURATION / 1000;
            if (bit === '1') {
                generateTone(data, offset, duration, TONE_FREQUENCY_HIGH, sampleRate);
            } else {
                generateTone(data, offset, duration, TONE_FREQUENCY_LOW, sampleRate);
            }
            offset += duration;
        });

        const source = audioCtx.createBufferSource();
        source.buffer = headerBuffer;
        source.connect(audioCtx.destination);
        source.start();
        console.log('Header transmission started.');
    }

    function generateTone(data, offset, duration, frequency, sampleRate) {
        const period = sampleRate / frequency;
        const amplitude = 0.5;
        for (let i = 0; i < duration; i++) {
            const t = (offset + i) % period;
            data[offset + i] = amplitude * Math.sin(2 * Math.PI * t / period);
        }
    }
});
