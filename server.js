const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { OpenAI } = require('openai');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const app = express();
const port = 3000;

// OpenAI-compatible Client (Manus Pre-configured)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

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
        const { message, mode } = req.body;
        const file = req.file;

        const modelName = mode === 'max' ? "gpt-4.1-mini" : "gpt-4.1-nano"; // Mapping to available models
        
        let systemMsg = `أنت أفنان 1.2، وكيل ذكاء اصطناعي متخصص حصرياً في البرمجة. 
        قدراتك تشمل:
        1. التعامل مع GitHub: يمكنك تحميل المستودعات، تحليل الملفات، إنشاء ملفات جديدة، وتعديل الكود.
        2. لغات البرمجة: خبير في كافة اللغات والأطر البرمجية.
        3. نظام الرصيد: أنت تعرف أن Flash يستهلك رصيداً عادياً بينما Max يستهلك الضعف.
        4. الموصلات: لديك موصل GitHub نشط.
        عند طلب تحميل مستودع، أخبر المستخدم أنك قمت بذلك وستقوم بالتحليل.`;

        let context = "";
        if (message && message.includes('github.com')) {
            const match = message.match(/https:\/\/github\.com\/[^\s]+/);
            if (match) {
                try {
                    const repoPath = githubManager.clone(match[0]);
                    const files = githubManager.listFiles(repoPath).slice(0, 10);
                    context = `\n[نظام]: تم تحميل المستودع في ${repoPath}. الملفات المكتشفة: ${files.map(f => path.basename(f)).join(', ')}`;
                } catch (e) {
                    context = `\n[نظام]: خطأ في GitHub: ${e.message}`;
                }
            }
        }

        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: systemMsg },
                { role: "user", content: (message || "") + context }
            ]
        });

        res.json({ output: response.choices[0].message.content });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'حدث خطأ في الخادم.' });
    }
});

app.listen(port, () => {
    console.log(`Afnan AI Programming Agent running on port ${port}`);
});
