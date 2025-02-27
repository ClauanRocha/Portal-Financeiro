const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db'); // <-- Agora está importando corretamente

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.get('/chamados', async (req, res) => {
    try {
        const [chamados] = await db.query(`
            SELECT 
            t.ticket_id, 
            t.number, 
            t.status_id, 
            t.staff_id, 
            t.created, 
            s.firstname AS atendente, 
            ts.name AS status
            FROM ost_ticket t
            LEFT JOIN ost_staff s ON t.staff_id = s.staff_id
            LEFT JOIN ost_ticket_status ts ON t.status_id = ts.id
            ORDER BY t.created DESC
        `);
        res.json(chamados);
    } catch (error) {
        console.error("Erro ao buscar chamados:", error); // Log do erro para debug
        res.status(500).json({ message: 'Erro ao buscar chamados', error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
