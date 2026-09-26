// Alagappa Performing Arts Academy - ID Card Generator JavaScript

let studentRecords = [
    {
        sNo: 1,
        enrollmentNo: "ALGBIN0001",
        name: "RIYANSHIKA THATIPARTHI",
        grade: "Pre - Grade",
        dob: "14-10-2019",
        mobile: "86103 88651",
        guru: "DEVIKA M",
        institute: "SRI BALAMBIGAI NATYALAYA",
        doj: "01-04-2024",
        photo: null
    },
    {
        sNo: 2,
        enrollmentNo: "ALGBIN0002",
        name: "KARUNYA SREE P",
        grade: "Pre - Grade",
        dob: "08-10-2019",
        mobile: "90259 03857",
        guru: "DEVIKA M",
        institute: "SRI BALAMBIGAI NATYALAYA",
        doj: "01-04-2024",
        photo: null
    },
    {
        sNo: 3,
        enrollmentNo: "ALGBIN0003",
        name: "SUPRIYA K",
        grade: "Pre - Grade",
        dob: "17-07-2017",
        mobile: "97862 24516",
        guru: "DEVIKA M",
        institute: "SRI BALAMBIGAI NATYALAYA",
        doj: "01-04-2024",
        photo: null
    },
    {
        sNo: 4,
        enrollmentNo: "ALGBIN0004",
        name: "KOSHIKA S",
        grade: "Pre - Grade",
        dob: "05-10-2015",
        mobile: "95052 09236",
        guru: "DEVIKA M",
        institute: "SRI BALAMBIGAI NATYALAYA",
        doj: "01-04-2024",
        photo: null
    },
    {
        sNo: 5,
        enrollmentNo: "ALGBIN0005",
        name: "PRAMATHI PG",
        grade: "Pre - Grade",
        dob: "04-11-2019",
        mobile: "95859 32777",
        guru: "DEVIKA M",
        institute: "SRI BALAMBIGAI NATYALAYA",
        doj: "01-04-2024",
        photo: null
    }
];

let currentIndex = 0;

// DOM Elements
const studentSelect = document.getElementById('studentSelect');
const searchInput = document.getElementById('searchInput');
const excelFileInput = document.getElementById('excelFile');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const statusText = document.getElementById('statusText');
const studentPhotoInput = document.getElementById('studentPhotoInput');

// Input Form Fields
const inputStudId = document.getElementById('inputStudId');
const inputName = document.getElementById('inputName');
const inputGrade = document.getElementById('inputGrade');
const inputDob = document.getElementById('inputDob');
const inputDoj = document.getElementById('inputDoj');
const inputInstitution = document.getElementById('inputInstitution');

// Card Display Elements
const cardStudId = document.getElementById('cardStudId');
const cardName = document.getElementById('cardName');
const cardGrade = document.getElementById('cardGrade');
const cardDob = document.getElementById('cardDob');
const cardInstitution = document.getElementById('cardInstitution');
const cardDoj = document.getElementById('cardDoj');
const cardPhotoImg = document.getElementById('cardPhotoImg');
const cardPhotoPlaceholder = document.getElementById('cardPhotoPlaceholder');

// Buttons
const downloadBtn = document.getElementById('downloadBtn');
const batchDownloadBtn = document.getElementById('batchDownloadBtn');

document.addEventListener('DOMContentLoaded', () => {
    updateRecordUI();
    setupEventListeners();
});

function setupEventListeners() {
    studentSelect.addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            currentIndex = val;
            updateRecordUI();
        }
    });

    searchInput.addEventListener('input', (e) => {
        filterStudentDropdown(e.target.value);
    });

    excelFileInput.addEventListener('change', handleExcelUpload);

    // Live two-way binding with input form fields
    inputStudId.addEventListener('input', (e) => { studentRecords[currentIndex].enrollmentNo = e.target.value; cardStudId.textContent = e.target.value; });
    inputName.addEventListener('input', (e) => { studentRecords[currentIndex].name = e.target.value; cardName.textContent = e.target.value; });
    inputGrade.addEventListener('input', (e) => { studentRecords[currentIndex].grade = e.target.value; cardGrade.textContent = e.target.value; });
    inputDob.addEventListener('input', (e) => { studentRecords[currentIndex].dob = e.target.value; cardDob.textContent = e.target.value; });
    inputDoj.addEventListener('input', (e) => { studentRecords[currentIndex].doj = e.target.value; cardDoj.textContent = e.target.value; });
    inputInstitution.addEventListener('input', (e) => { studentRecords[currentIndex].institute = e.target.value; cardInstitution.textContent = e.target.value; });

    studentPhotoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                studentRecords[currentIndex].photo = uploadEvent.target.result;
                displayCardPhoto(studentRecords[currentIndex].photo);
            };
            reader.readAsDataURL(file);
        }
    });

    downloadBtn.addEventListener('click', downloadCurrentCardPNG);
    batchDownloadBtn.addEventListener('click', downloadAllCardsZIP);
}

function updateRecordUI() {
    if (studentRecords.length === 0) return;

    if (studentSelect.options.length !== studentRecords.length + 1) {
        studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
        studentRecords.forEach((rec, idx) => {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `${rec.enrollmentNo} — ${rec.name}`;
            studentSelect.appendChild(opt);
        });
    }

    studentSelect.value = currentIndex;
    const student = studentRecords[currentIndex];

    // Update Input Fields
    inputStudId.value = student.enrollmentNo || '';
    inputName.value = student.name || '';
    inputGrade.value = student.grade || '';
    inputDob.value = student.dob || '';
    inputDoj.value = student.doj || '01-04-2024';
    inputInstitution.value = student.institute || 'SRI BALAMBIGAI NATYALAYA';

    // Update ID Card Canvas
    cardStudId.textContent = student.enrollmentNo || '---';
    cardName.textContent = student.name || '---';
    cardGrade.textContent = student.grade || '---';
    cardDob.textContent = student.dob || '---';
    cardInstitution.textContent = student.institute || 'SRI BALAMBIGAI NATYALAYA';
    cardDoj.textContent = student.doj || '01-04-2024';

    if (student.photo) {
        displayCardPhoto(student.photo);
    } else {
        cardPhotoImg.classList.add('hidden');
        cardPhotoPlaceholder.classList.remove('hidden');
    }

    statusText.textContent = `Loaded ${studentRecords.length} student(s).`;
}

function filterStudentDropdown(query) {
    const q = query.toLowerCase();
    studentSelect.innerHTML = '<option value="">-- Select Student --</option>';
    studentRecords.forEach((rec, idx) => {
        if (rec.name.toLowerCase().includes(q) || rec.enrollmentNo.toLowerCase().includes(q)) {
            const opt = document.createElement('option');
            opt.value = idx;
            opt.textContent = `${rec.enrollmentNo} — ${rec.name}`;
            studentSelect.appendChild(opt);
        }
    });
}

function displayCardPhoto(src) {
    cardPhotoImg.src = src;
    cardPhotoImg.classList.remove('hidden');
    cardPhotoPlaceholder.classList.add('hidden');
}

function handleExcelUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    fileNameDisplay.textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

            if (jsonRows.length === 0) {
                alert('The uploaded file contains no records.');
                return;
            }

            studentRecords = jsonRows.map((row, idx) => {
                const getVal = (possibleKeys) => {
                    for (let key of Object.keys(row)) {
                        if (possibleKeys.includes(key.trim().toUpperCase())) {
                            return row[key];
                        }
                    }
                    return '';
                };

                return {
                    sNo: getVal(['S.NO', 'S NO', 'SL NO', 'NO']) || (idx + 1),
                    enrollmentNo: getVal(['ENROLLMENT NO', 'STUDENT ID', 'ID', 'REG NO']) || `ALGBIN000${idx+1}`,
                    name: getVal(['NAME', 'STUDENT NAME', 'FULL NAME']) || 'UNKNOWN STUDENT',
                    grade: getVal(['GRADE', 'CLASS', 'LEVEL']) || 'Pre - Grade',
                    dob: getVal(['DATE OF BIRTH', 'DOB', 'BIRTHDATE']) || '01-01-2020',
                    mobile: getVal(['MOBILE NO', 'PHONE', 'CONTACT']) || '',
                    guru: getVal(['GURU', 'TEACHER', 'INSTRUCTOR']) || 'DEVIKA M',
                    institute: getVal(['NAME OF THE INSTITUTE', 'INSTITUTE', 'SCHOOL', 'ACADEMY']) || 'SRI BALAMBIGAI NATYALAYA',
                    doj: getVal(['DATE OF JOINING', 'DOJ']) || '01-04-2024',
                    photo: null
                };
            });

            currentIndex = 0;
            updateRecordUI();
        } catch (err) {
            console.error(err);
            alert('Error parsing Excel file.');
        }
    };
    reader.readAsArrayBuffer(file);
}

function downloadCurrentCardPNG() {
    const canvasElement = document.getElementById('idCardCanvas');
    downloadBtn.textContent = 'Generating...';
    downloadBtn.disabled = true;

    html2canvas(canvasElement, { scale: 3, useCORS: true, backgroundColor: null }).then(canvas => {
        canvas.toBlob(blob => {
            const student = studentRecords[currentIndex];
            const fileName = `${student.enrollmentNo}_${student.name.replace(/\s+/g, '_')}_IDCard.png`;
            saveAs(blob, fileName);
            downloadBtn.textContent = '📥 Download Card (PNG)';
            downloadBtn.disabled = false;
        });
    }).catch(err => {
        console.error(err);
        alert('Error generating image.');
        downloadBtn.textContent = '📥 Download Card (PNG)';
        downloadBtn.disabled = false;
    });
}

async function downloadAllCardsZIP() {
    if (studentRecords.length === 0) return;
    if (!confirm(`Generate and download ID cards for all ${studentRecords.length} students in a ZIP file?`)) return;

    batchDownloadBtn.textContent = 'Processing ZIP...';
    batchDownloadBtn.disabled = true;

    const zip = new JSZip();
    const folder = zip.folder("Alagappa_ID_Cards");
    const canvasElement = document.getElementById('idCardCanvas');
    const originalIndex = currentIndex;

    for (let i = 0; i < studentRecords.length; i++) {
        currentIndex = i;
        updateRecordUI();
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const canvas = await html2canvas(canvasElement, { scale: 2, useCORS: true, backgroundColor: null });
            const dataUrl = canvas.toDataURL('image/png');
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            const student = studentRecords[i];
            const fileName = `${student.enrollmentNo}_${student.name.replace(/\s+/g, '_')}_ID.png`;
            folder.file(fileName, base64Data, { base64: true });
        } catch (err) {
            console.error(`Failed for record ${i}:`, err);
        }
    }

    currentIndex = originalIndex;
    updateRecordUI();

    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "Alagappa_Performing_Arts_Academy_ID_Cards.zip");
        batchDownloadBtn.textContent = '📦 Export All (ZIP)';
        batchDownloadBtn.disabled = false;
    });
}