// Guitar Neck Visualizer
class GuitarVisualizer {
    constructor() {
        this.canvas = document.getElementById('guitar-neck');
        this.ctx = this.canvas.getContext('2d');
        this.frets = 24; // Number of frets to display
        this.strings = 6; // Number of strings
        this.currentInstrument = 'guitar'; // Current instrument

        // Drag functionality
        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;
        this.neckWrapper = document.querySelector('.neck-wrapper');

        // Initialize instrument configurations
        this.instruments = {
            'guitar': {
                strings: 6,
                tunings: {
                    'standard': ['E', 'A', 'D', 'G', 'B', 'E'],
                    'open-f9': ['F', 'A', 'C', 'G', 'C', 'E'],
                    'drop-d': ['D', 'A', 'D', 'G', 'B', 'E'],
                    'drop-c': ['C', 'G', 'C', 'F', 'A', 'D'],
                    'drop-b': ['B', 'F#', 'B', 'E', 'G#', 'C#'],
                    'drop-a': ['A', 'E', 'A', 'D', 'F#', 'B'],
                    'double-drop-d': ['D', 'A', 'D', 'G', 'B', 'D'],
                    'open-g': ['D', 'G', 'D', 'G', 'B', 'D'],
                    'open-a': ['E', 'A', 'C#', 'E', 'A', 'E'],
                    'open-c': ['C', 'G', 'C', 'G', 'C', 'E'],
                    'open-d': ['D', 'A', 'D', 'F#', 'A', 'D'],
                    'open-e': ['E', 'B', 'E', 'G#', 'B', 'E'],
                    'dadgad': ['D', 'A', 'D', 'G', 'A', 'D'],
                    'c6': ['C', 'A', 'C', 'G', 'C', 'E'],
                    'modal-d': ['D', 'A', 'D', 'G', 'A', 'D'],
                    'half-step-down': ['D#', 'G#', 'C#', 'F#', 'A#', 'D#'],
                    'whole-step-down': ['D', 'G', 'C', 'F', 'A', 'D'],
                    'nst': ['C#', 'G#', 'D#', 'A#', 'F', 'C#'],
                    'all-fourths': ['E', 'A', 'D', 'G', 'C', 'F'],
                    'major-thirds': ['C', 'E', 'G#', 'C', 'E', 'G#']
                }
            },
            'baritone': {
                strings: 6,
                tunings: {
                    'standard': ['A', 'D', 'G', 'C', 'E', 'A'], // Down a fourth from standard guitar
                    'drop-a': ['A', 'D', 'G', 'C', 'E', 'A'], // Same as standard baritone
                    'b-standard': ['B', 'E', 'A', 'D', 'F#', 'B'], // Down a fifth from standard guitar
                    'drop-b': ['B', 'E', 'A', 'D', 'F#', 'B'], // Same as B standard
                    'open-d': ['D', 'A', 'D', 'F#', 'A', 'D'], // Open D for baritone
                    'half-step-down': ['A#', 'D#', 'G#', 'C#', 'F', 'A#'],
                    'whole-step-down': ['G#', 'C#', 'F#', 'B', 'D#', 'G#']
                }
            },
            'bass-4': {
                strings: 4,
                tunings: {
                    'standard': ['E', 'A', 'D', 'G'],
                    'drop-d': ['D', 'A', 'D', 'G'],
                    'half-step-down': ['D#', 'G#', 'C#', 'F#'],
                    'whole-step-down': ['D', 'G', 'C', 'F']
                }
            },
            'bass-5': {
                strings: 5,
                tunings: {
                    'standard': ['B', 'E', 'A', 'D', 'G'],
                    'drop-a': ['A', 'E', 'A', 'D', 'G'],
                    'high-c': ['C', 'E', 'A', 'D', 'G']
                }
            },
            'bass-6': {
                strings: 6,
                tunings: {
                    'standard': ['B', 'E', 'A', 'D', 'G', 'C'],
                    'drop-a': ['A', 'E', 'A', 'D', 'G', 'C'],
                    'f-sharp': ['F#', 'B', 'E', 'A', 'D', 'G']
                }
            },
            'guitar-7': {
                strings: 7,
                tunings: {
                    'standard': ['B', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'drop-a': ['A', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'drop-g': ['G', 'D', 'G', 'C', 'F', 'A', 'D'],
                    'open-g-minor': ['D', 'G', 'D', 'G', 'A#', 'D', 'G'],
                    'half-step-down': ['A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#']
                }
            },
            'guitar-8': {
                strings: 8,
                tunings: {
                    'standard': ['F#', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'drop-e': ['E', 'B', 'E', 'A', 'D', 'G', 'B', 'E'],
                    'drop-c': ['C', 'G', 'C', 'F', 'A', 'D', 'G', 'B'],
                    'open-f': ['F', 'C', 'F', 'A#', 'D#', 'G#', 'C', 'F'],
                    'half-step-down': ['F', 'A#', 'D#', 'G#', 'C#', 'F#', 'A#', 'D#']
                }
            }
        };

        // Set initial tunings to guitar tunings
        this.tunings = this.instruments[this.currentInstrument].tunings;

        // Initialize scales (intervals from root)
        this.scales = {
            // Basic scales
            'major': [0, 2, 4, 5, 7, 9, 11], // W W H W W W H
            'minor': [0, 2, 3, 5, 7, 8, 10], // W H W W H W W
            'harmonic-minor': [0, 2, 3, 5, 7, 8, 11], // W H W W H A H
            'melodic-minor': [0, 2, 3, 5, 7, 9, 11], // W H W W W W H (ascending)

            // Major modes
            'ionian': [0, 2, 4, 5, 7, 9, 11], // Major/Ionian
            'dorian': [0, 2, 3, 5, 7, 9, 10], // W H W W W H W
            'phrygian': [0, 1, 3, 5, 7, 8, 10], // H W W W H W W
            'lydian': [0, 2, 4, 6, 7, 9, 11], // W W W H W W H
            'mixolydian': [0, 2, 4, 5, 7, 9, 10], // W W H W W H W
            'aeolian': [0, 2, 3, 5, 7, 8, 10], // W H W W H W W (natural minor)
            'locrian': [0, 1, 3, 5, 6, 8, 10], // H W W H W W W

            // Minor modes
            'dorian-minor': [0, 2, 3, 5, 7, 9, 10], // Same as Dorian
            'phrygian-minor': [0, 1, 3, 5, 7, 8, 10], // Same as Phrygian
            'lydian-minor': [0, 2, 4, 6, 7, 8, 10], // W W W H H W W
            'mixolydian-minor': [0, 2, 4, 5, 7, 8, 10], // W W H W H W W

            // Harmonic minor modes
            'harmonic-minor-scale': [0, 2, 3, 5, 7, 8, 11], // Harmonic minor
            'locrian-natural-6': [0, 1, 3, 5, 6, 9, 10], // H W W H A H H
            'ionian-augmented': [0, 2, 4, 5, 8, 9, 11], // W W H A H H W
            'dorian-sharp-4': [0, 2, 3, 6, 7, 9, 10], // W H A H W H W
            'phrygian-dominant': [0, 1, 4, 5, 7, 8, 10], // H A H W H W W
            'lydian-sharp-2': [0, 3, 4, 6, 7, 9, 11], // A H W H W W H
            'super-locrian': [0, 1, 3, 4, 6, 8, 10], // H W H W W W W

            // Melodic minor modes
            'melodic-minor-scale': [0, 2, 3, 5, 7, 9, 11], // Melodic minor (ascending)
            'dorian-flat-2': [0, 1, 3, 5, 7, 9, 10], // H W W W W H W
            'lydian-augmented-2': [0, 2, 4, 6, 8, 9, 11], // W W W A H H W
            'lydian-dominant': [0, 2, 4, 6, 7, 9, 10], // W W W H W H W
            'mixolydian-flat-6': [0, 2, 4, 5, 7, 8, 10], // W W H W H W W
            'locrian-sharp-2': [0, 1, 3, 5, 6, 8, 11], // H W W H W A H
            'altered': [0, 1, 3, 4, 6, 8, 10], // H W H W W W W

            // Pentatonic scales
            'pentatonic-major': [0, 2, 4, 7, 9], // Major pentatonic
            'pentatonic-minor': [0, 3, 5, 7, 10], // Minor pentatonic
            'pentatonic-dorian': [0, 2, 3, 5, 7, 9, 10], // Dorian with flattened 7th
            'pentatonic-egyptian': [0, 2, 5, 7, 10], // Egyptian pentatonic

            // Blues scales
            'blues': [0, 3, 5, 6, 7, 10], // Minor blues
            'blues-major': [0, 2, 4, 5, 7, 9, 10], // Major blues
            'blues-minor': [0, 3, 5, 6, 7, 10], // Same as blues

            // Diminished scales
            'diminished-whole-half': [0, 2, 3, 5, 6, 8, 9, 11], // Whole-half diminished
            'diminished-half-whole': [0, 1, 3, 4, 6, 7, 9, 10], // Half-whole diminished

            // Augmented scales
            'augmented': [0, 3, 4, 7, 8, 11], // Augmented (symmetrical)
            'whole-tone': [0, 2, 4, 6, 8, 10], // Whole tone scale

            // Bebop scales
            'bebop-major': [0, 2, 4, 5, 7, 8, 9, 11], // Major bebop
            'bebop-dominant': [0, 2, 4, 5, 7, 9, 10, 11], // Dominant bebop
            'bebop-minor': [0, 2, 3, 5, 7, 8, 9, 10], // Minor bebop

            // Hexatonic scales
            'hexatonic-blues': [0, 3, 5, 6, 7, 10], // Same as blues
            'hexatonic-prometheus': [0, 2, 4, 6, 9, 10], // Prometheus
            'hexatonic-tritone': [0, 1, 4, 6, 7, 10], // Tritone

            // Other scales
            'chromatic': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // All 12 notes
            'major-7': [0, 2, 4, 5, 7, 9, 10], // Mixolydian (dominant 7th)
            'minor-7': [0, 2, 3, 5, 7, 8, 10], // Dorian minor 7th
            'dominant-7': [0, 2, 4, 5, 7, 9, 10], // Mixolydian
            'diminished-7': [0, 2, 3, 5, 6, 8, 9, 11], // Whole-half diminished
            'minor-7-flat-5': [0, 2, 3, 5, 6, 8, 10], // Locrian
            'minor-major-7': [0, 2, 3, 5, 7, 9, 11], // Melodic minor
            '7-sharp-5': [0, 2, 4, 6, 7, 9, 10], // Lydian dominant
            '7-flat-9': [0, 1, 3, 5, 7, 8, 10], // Phrygian dominant
            '9': [0, 2, 4, 5, 7, 9, 10, 14], // Dominant 9th (extended)
            '11': [0, 2, 4, 5, 7, 9, 10, 14, 16], // Dominant 11th
            '13': [0, 2, 4, 5, 7, 9, 10, 14, 16, 21] // Dominant 13th
        };

        // Note names in chromatic order
        this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        // Current settings
        this.currentTuning = 'open-f9'; // Start with Open F9Major as requested
        this.currentScale = 'major';
        this.currentRoot = 'C';

        // Theme and display settings
        this.currentTheme = 'dark';
        this.showFretNumbers = true;
        this.showStringLabels = true;
        this.showScaleIndicators = true;

        // Initialize event listeners
        this.initEventListeners();

        // Initialize tuning options
        this.updateTuningOptions();

        // Initialize header
        this.updateHeader();

        // Initialize theme
        this.setTheme(this.currentTheme);

        // Draw initial neck
        this.draw();
    }

    initEventListeners() {
        document.getElementById('instrument-select').addEventListener('change', (e) => {
            this.currentInstrument = e.target.value;
            this.strings = this.instruments[this.currentInstrument].strings;
            this.tunings = this.instruments[this.currentInstrument].tunings;
            this.updateTuningOptions();
            this.currentTuning = Object.keys(this.tunings)[0]; // Reset to first available tuning
            this.updateHeader();
            this.draw();
        });

        document.getElementById('tuning-select').addEventListener('change', (e) => {
            this.currentTuning = e.target.value;
            this.updateHeader();
            this.draw();
        });

        document.getElementById('scale-select').addEventListener('change', (e) => {
            this.currentScale = e.target.value;
            this.updateHeader();
            this.draw();
        });

        document.getElementById('root-select').addEventListener('change', (e) => {
            this.currentRoot = e.target.value;
            this.updateHeader();
            this.draw();
        });

        // Settings modal
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettingsModal();
        });

        document.querySelector('.close-btn').addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('settings-modal')) {
                this.hideSettingsModal();
            }
        });

        // Theme buttons
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.setTheme(theme);
            });
        });

        // Style options
        document.getElementById('show-fret-numbers').addEventListener('change', (e) => {
            this.showFretNumbers = e.target.checked;
            this.draw();
        });

        document.getElementById('show-string-labels').addEventListener('change', (e) => {
            this.showStringLabels = e.target.checked;
            this.draw();
        });

        document.getElementById('show-scale-indicators').addEventListener('change', (e) => {
            this.showScaleIndicators = e.target.checked;
            this.draw();
        });

        // Initialize drag functionality for neck scrolling
        this.initDragListeners();
    }

    initDragListeners() {
        if (!this.neckWrapper) return;

        // Mouse events
        this.neckWrapper.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.startX = e.pageX - this.neckWrapper.offsetLeft;
            this.scrollLeft = this.neckWrapper.scrollLeft;
            this.neckWrapper.style.cursor = 'grabbing';
        });

        this.neckWrapper.addEventListener('mouseleave', () => {
            this.isDragging = false;
            this.neckWrapper.style.cursor = 'grab';
        });

        this.neckWrapper.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.neckWrapper.style.cursor = 'grab';
        });

        this.neckWrapper.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX - this.neckWrapper.offsetLeft;
            const walk = (x - this.startX) * 2; // Scroll speed multiplier
            this.neckWrapper.scrollLeft = this.scrollLeft - walk;
        });

        // Touch events for mobile
        this.neckWrapper.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].pageX - this.neckWrapper.offsetLeft;
            this.scrollLeft = this.neckWrapper.scrollLeft;
        });

        this.neckWrapper.addEventListener('touchend', () => {
            this.isDragging = false;
        });

        this.neckWrapper.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const x = e.touches[0].pageX - this.neckWrapper.offsetLeft;
            const walk = (x - this.startX) * 2; // Scroll speed multiplier
            this.neckWrapper.scrollLeft = this.scrollLeft - walk;
        });
    }

    updateTuningOptions() {
        const tuningSelect = document.getElementById('tuning-select');
        tuningSelect.innerHTML = '';

        for (const [tuningKey, tuningNotes] of Object.entries(this.tunings)) {
            const option = document.createElement('option');
            option.value = tuningKey;

            // Create a readable label for the tuning
            const tuningString = tuningNotes.join('');
            let label = tuningKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            // Add the note string for clarity
            option.textContent = `${label} (${tuningString})`;
            tuningSelect.appendChild(option);
        }
    }

    updateHeader() {
        const headerElement = document.getElementById('main-header');

        // Get instrument display name
        const instrumentOptions = {
            'guitar': 'Guitar (6 strings)',
            'guitar-7': 'Guitar (7 strings)',
            'guitar-8': 'Guitar (8 strings)',
            'baritone': 'Baritone Guitar (6 strings)',
            'bass-4': 'Bass Guitar (4 strings)',
            'bass-5': 'Bass Guitar (5 strings)',
            'bass-6': 'Bass Guitar (6 strings)'
        };

        const instrumentName = instrumentOptions[this.currentInstrument] || 'String Instrument';

        // Get current tuning display name
        const currentTuningNotes = this.tunings[this.currentTuning] || [];
        const tuningString = currentTuningNotes.join('');
        const tuningLabel = this.currentTuning.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Get current scale display name
        const scaleLabel = this.currentScale.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        // Update header HTML
        headerElement.innerHTML = `
            <span class="instrument-name">${instrumentName}</span>
            <span class="settings">(${tuningLabel} - ${scaleLabel} - ${this.currentRoot})</span>
        `;
    }

    showSettingsModal() {
        document.getElementById('settings-modal').style.display = 'block';
        // Update checkboxes to reflect current settings
        document.getElementById('show-fret-numbers').checked = this.showFretNumbers;
        document.getElementById('show-string-labels').checked = this.showStringLabels;
        document.getElementById('show-scale-indicators').checked = this.showScaleIndicators;
        // Update active theme button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === this.currentTheme) {
                btn.classList.add('active');
            }
        });
    }

    hideSettingsModal() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.className = `theme-${theme}`;
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.theme === theme) {
                btn.classList.add('active');
            }
        });
        // Redraw canvas with new theme colors
        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Get theme colors from CSS custom properties
        const computedStyle = getComputedStyle(document.body);
        const fretLineColor = computedStyle.getPropertyValue('--fret-line-color').trim();
        const stringLineColor = computedStyle.getPropertyValue('--string-line-color').trim();
        const fretMarkerColor = computedStyle.getPropertyValue('--fret-marker-color').trim();
        const fretNumberColor = computedStyle.getPropertyValue('--fret-number-color').trim();
        const stringLabelColor = computedStyle.getPropertyValue('--string-label-color').trim();
        const scaleNoteColor = computedStyle.getPropertyValue('--scale-note-color').trim();
        const rootNoteColor = computedStyle.getPropertyValue('--root-note-color').trim();

        // Set dimensions
        const width = this.canvas.width;
        const height = this.canvas.height;
        const stringSpacing = height / (this.strings + 1);
        // Fret spacing should span from nut (50px offset) to end of strings (width - 20)
        // For N frets, we need N+1 fret lines (nut + N frets)
        const fretSpacing = (width - 70) / this.frets;

        // Draw frets (vertical lines)
        this.ctx.strokeStyle = fretLineColor;
        this.ctx.lineWidth = 2;

        for (let fret = 0; fret <= this.frets; fret++) {
            const x = fret * fretSpacing + 50; // Offset for string labels
            this.ctx.beginPath();
            this.ctx.moveTo(x, 20);
            this.ctx.lineTo(x, height - 20);
            this.ctx.stroke();

            // Draw fret markers (positioned between frets, not on fret lines)
            if (fret > 0 && (fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 12)) {
                const markerX = (fret - 0.5) * fretSpacing + 50; // Center of fret interval
                this.ctx.fillStyle = fretMarkerColor;
                this.ctx.beginPath();
                if (fret === 12) {
                    // Double dots for 12th fret
                    this.ctx.arc(markerX, height / 2 - 15, 4, 0, 2 * Math.PI);
                    this.ctx.arc(markerX, height / 2 + 15, 4, 0, 2 * Math.PI);
                } else {
                    this.ctx.arc(markerX, height / 2, 4, 0, 2 * Math.PI);
                }
                this.ctx.fill();
            }

            // Add fret numbers under the frets
            if (this.showFretNumbers && fret > 0 && fret <= this.frets) {
                const numberX = (fret - 0.5) * fretSpacing + 50; // Position under the frets, not in the middle of inlays
                this.ctx.fillStyle = fretNumberColor;
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(fret.toString(), numberX, height - 5);
            }
        }

        // Draw strings (horizontal lines) - flipped so low E is at top, high E at bottom
        this.ctx.strokeStyle = stringLineColor;
        this.ctx.lineWidth = 1;

        for (let string = 1; string <= this.strings; string++) {
            const y = (this.strings - string + 1) * stringSpacing; // Flip the string positions
            this.ctx.beginPath();
            this.ctx.moveTo(50, y);
            this.ctx.lineTo(width - 20, y);
            this.ctx.stroke();

            // Add string labels (tuning)
            if (this.showStringLabels) {
                const tuning = this.tunings[this.currentTuning];
                this.ctx.fillStyle = stringLabelColor;
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'right';
                this.ctx.fillText(tuning[string - 1], 40, y + 5);
            }
        }

        // Draw notes and scale
        this.drawNotesAndScale(stringSpacing, fretSpacing);
    }

    drawNotesAndScale(stringSpacing, fretSpacing) {
        const tuning = this.tunings[this.currentTuning];
        const scaleIntervals = this.scales[this.currentScale];
        const rootNoteIndex = this.notes.indexOf(this.currentRoot);

        // Get theme colors from CSS custom properties
        const computedStyle = getComputedStyle(document.body);
        const scaleNoteColor = computedStyle.getPropertyValue('--scale-note-color').trim();
        const rootNoteColor = computedStyle.getPropertyValue('--root-note-color').trim();

        // First, draw scale indicators under string labels
        if (this.showScaleIndicators) {
            for (let string = 1; string <= this.strings; string++) {
                const y = (this.strings - string + 1) * stringSpacing; // Match flipped string positions
                const openStringNote = tuning[string - 1];
                const openStringIndex = this.notes.indexOf(openStringNote);

                // Check if this open string note is in the current scale
                const intervalFromRoot = (openStringIndex - rootNoteIndex + 12) % 12;
                const isInScale = scaleIntervals.includes(intervalFromRoot);
                const isRoot = intervalFromRoot === 0;

            if (isInScale) {
                // Draw circle under the string label
                this.ctx.beginPath();
                this.ctx.arc(25, y + 20, 8, 0, 2 * Math.PI);

                if (isRoot) {
                    this.ctx.fillStyle = rootNoteColor;
                } else {
                    this.ctx.fillStyle = scaleNoteColor;
                }

                this.ctx.fill();
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
            }
            }
        }

        // Then draw notes on the fretboard (only for frets 1+)
        for (let string = 1; string <= this.strings; string++) {
            const y = (this.strings - string + 1) * stringSpacing; // Match flipped string positions
            const openStringNote = tuning[string - 1];
            const openStringIndex = this.notes.indexOf(openStringNote);

            for (let fret = 1; fret <= this.frets; fret++) {
                // Calculate note at this fret position
                // Each fret represents one semitone higher than the previous fret
                const semitonesAboveOpen = fret;
                const noteIndex = (openStringIndex + semitonesAboveOpen) % 12;
                const noteName = this.notes[noteIndex];

                // Check if this note is in the current scale
                const intervalFromRoot = (noteIndex - rootNoteIndex + 12) % 12;
                const isInScale = scaleIntervals.includes(intervalFromRoot);
                const isRoot = intervalFromRoot === 0;

                if (isInScale) {
                    // Position between frets (correct for frets 1+)
                    const x = (fret - 0.5) * fretSpacing + 50;

                    // Draw note circle
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 10, 0, 2 * Math.PI);

                    if (isRoot) {
                        this.ctx.fillStyle = rootNoteColor;
                    } else {
                        this.ctx.fillStyle = scaleNoteColor;
                    }

                    this.ctx.fill();
                    this.ctx.strokeStyle = '#fff';
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();

                    // Draw note name
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = 'bold 9px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(noteName, x, y + 3);
                }
            }
        }
    }
}

// Initialize the visualizer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GuitarVisualizer();
});
