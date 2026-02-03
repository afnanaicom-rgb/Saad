const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// OpenRouter Configuration
const OPENROUTER_API_KEY = "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";
const MODEL_NAME = "sourceful/riverflow-v2-pro";

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

// GitHub & File System Manager
const githubManager = {
    baseDir: path.join(__dirname, 'repos'),
    init: () => {
        if (!fs.existsSync(githubManager.baseDir)) fs.mkdirSync(githubManager.baseDir);
    },
    clone: (repoUrl) => {
        const repoName = path.basename(repoUrl, '.git').replace(/[^a-zA-Z0-9]/g, '_');
        const targetPath = path.join(githubManager.baseDir, repoName);
        if (fs.existsSync(targetPath)) {
            execSync(`cd ${targetPath} && git pull`);
        } else {
            execSync(`git clone ${repoUrl} ${targetPath}`);
        }
        return targetPath;
    },
    listFiles: (dirPath) => {
        let results = [];
        if (!fs.existsSync(dirPath)) return results;
        const list = fs.readdirSync(dirPath);
        list.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                if (file !== '.git' && file !== 'node_modules') {
                    results = results.concat(githubManager.listFiles(fullPath));
                }
            } else {
                results.push(fullPath);
            }
        });
        return results;
    }
};

githubManager.init();

app.post('/api/chat', upload.single('file'), async (req, res) => {
    try {
        const { message, mode, isPro } = req.body;
        const file = req.file;

        // Restriction for Max model
        if (mode === 'max' && !isPro) {
            return res.status(403).json({ error: 'نموذج Max متاح فقط لمشتركي خطة Pro.' });
        }

        let systemMsg = `أنت أفنان 1.2، وكيل ذكاء اصطناعي متخصص حصرياً في البرمجة. 
        قدراتك تشمل:
        1. التعامل مع GitHub: يمكنك تحميل المستودعات، تحليل الملفات، إنشاء ملفات جديدة، وتعديل الكود.
        2. لغات البرمجة: خبير في كافة اللغات والأطر البرمجية.
        3. نظام الرصيد: أنت تعرف أن Flash يستهلك رصيداً عادياً بينما Max يستهلك الضعف.
        4. الموصلات: لديك موصل GitHub نشط.
        يجب أن تكون إجاباتك دقيقة وبرمجية بحتة.`;

        let context = "";
        if (message && message.includes('github.com')) {
            const match = message.match(/https:\/\/github\.com\/[^\s]+/);
            if (match) {
                try {
                    const repoPath = githubManager.clone(match[0]);
                    const files = githubManager.listFiles(repoPath).slice(0, 10);
                    context = `\n[نظام]: تم تحميل المستودع. الملفات المكتشفة: ${files.map(f => path.basename(f)).join(', ')}`;
                } catch (e) {
                    context = `\n[نظام]: خطأ في GitHub: ${e.message}`;
                }
            }
        }

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: MODEL_NAME,
            messages: [
                { role: "system", content: systemMsg },
                { role: "user", content: (message || "") + context }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ output: response.data.choices[0].message.content });
    } catch (error) {
        console.error('OpenRouter API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'حدث خطأ في الاتصال بـ OpenRouter.' });
    }
});

app.listen(port, () => {
    console.log(`Afnan AI Server (OpenRouter) running on port ${port}`);
});
