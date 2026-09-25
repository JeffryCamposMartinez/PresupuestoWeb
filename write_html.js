const fs = require('fs');
const html = <!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Presupuesto Personal</title>
<style>
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #313338; color: #e0e0e0; margin: 0; padding: 0; box-sizing: border-box; }
.dashboard { max-width: 1100px; margin: 0 auto; overflow: hidden; display: flex; flex-wrap: wrap; gap: 2%; padding: 20px; }
.card { background-color: #2b2d31; padding: 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); box-sizing: border-box; flex: 1; min-width: 300px; }
.card.settings { flex: 0 0 33%; }
.card.history { flex: 1 1 60%; }
@media (max-width: 800px) { .card.settings, .card.history { flex: 1 1 100%; } }
h1, h2 { color: #bb86fc; font-weight: 600; margin-top: 0; }
input[type=number], input[type=text], select { padding: 12px; margin: 10px 0; border: 1px solid #333; border-radius: 6px; background-color: #252830; color: #fff; font-size: 16px; outline: none; box-sizing: border-box; width: 100%; }
input[type=number]:focus, input[type=text]:focus, select:focus { border-color: #bb86fc; }
button.action-btn { background-color: #bb86fc; color: #0f1015; border: none; padding: 14px; margin-top: 10px; font-size: 16px; font-weight: bold; border-radius: 6px; cursor: pointer; transition: background-color 0.3s ease; width: 100%; }
button.action-btn:hover { background-color: #9965f4; }
table { width: 100%; border-collapse: collapse; margin-top: 15px; }
th, td { text-align: left; padding: 12px; border-bottom: 1px solid #2d313a; vertical-align: middle; }
th { color: #03dac6; font-weight: 600; }
tr:hover { background-color: #252830; }
.info-box { background-color: #252830; border-left: 4px solid #03dac6; padding: 15px; margin-bottom: 20px; border-radius: 4px; display: flex; flex-direction: column; gap: 10px; }
.setting-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; }
.input-group { display: flex; gap: 5px; align-items: center; justify-content: flex-end; }
.month-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin: 15px 0; }
.month-btn { background-color: #252830; border: 1px solid #333; color: #e0e0e0; padding: 10px 0; border-radius: 6px; cursor: pointer; font-size: 14px; transition: all 0.2s; text-align: center; }
.month-btn:hover { border-color: #bb86fc; }
.month-btn.active { background-color: #bb86fc; color: #0f1015; border-color: #bb86fc; font-weight: bold; }
.icon-btn { background-color: #252830; border: 1px solid #333; padding: 8px 10px; border-radius: 6px; cursor: pointer; font-size: 14px; margin-right: 5px; transition: all 0.2s; color: #bb86fc; }
.icon-btn:hover { border-color: #bb86fc; background-color: #1a1c23; }
.icon-btn.delete { color: #cf6679; }
.icon-btn.delete:hover { border-color: #cf6679; }
.titlebar { background-color: #1e1f22; height: 32px; display: flex; justify-content: space-between; align-items: center; padding-left: 15px; padding-right: 15px; user-select: none; border-bottom: 1px solid #111214; }
.titlebar-title { color: #80848e; font-size: 12px; font-weight: 600; letter-spacing: 1px; }
.charge-item { display: flex; justify-content: space-between; align-items: center; background-color: #1a1c23; padding: 10px 15px; border-radius: 6px; margin-bottom: 8px; font-size: 14px; }
.charge-name { flex: 1; color: #e0e0e0; font-weight: 500; }
.charge-value { color: #03dac6; font-weight: 600; margin-right: 15px; }
</style>
</head>
<body>

<div class="titlebar">
    <div class="titlebar-title">PRESUPUESTO PERSONAL (WEB)</div>
</div>

<div class="dashboard">
    <div class="card settings">
        <h1>Configuración</h1>
        <div class="info-box">
            <div class="setting-row" style="flex-direction: column; align-items: stretch; gap: 10px;">
                <strong>Cargos Fijos:</strong>
                <div class="charges-list" id="chargesList">
                    <!-- Dynamic charges here -->
                </div>
                <div class="input-group" style="justify-content: space-between; gap: 10px; margin-top: 5px;">
                    <input type="text" id="newChargeName" placeholder="Ej: Spotify" style="flex: 1;">
                    <input type="number" id="newChargeVal" placeholder="Monto" style="width: 100px;">
                    <button class="action-btn" style="width: auto; margin-top: 0; padding: 10px 15px;" onclick="addCharge()">+</button>
                </div>
            </div>
            <div class="setting-row" style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #333;">
                <strong style="color: #03dac6;">Total Gastos:</strong>
                <div class="input-group">
                    <span style="color:#03dac6; font-weight:bold;">$</span>
                    <input type="number" id="fixedInput" value="0" readonly style="background-color: transparent; border: none; text-align: right; pointer-events: none; color: #03dac6; font-weight: bold; width:auto;">
                </div>
            </div>
        </div>
        
        <h2 style="font-size: 16px; margin-bottom: 5px;">Seleccionar Mes:</h2>
        <div class="month-grid" id="monthGrid">
            <!-- Dynamic months -->
        </div>
        
        <input type="number" id="incomeInput" placeholder="Ingreso total mensual (CLP)" min="0">
        <button class="action-btn" onclick="distribuir()">Guardar y Calcular</button>
    </div>
    
    <div class="card history">
        <h2>Historial de Presupuestos</h2>
        <div style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <th>Mes</th>
                        <th>Ingreso</th>
                        <th>Gastos Totales</th>
                        <th>Ahorro</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="historyBody">
                    <!-- Dynamic history -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    // Initial data matching the original C++ app
    const defaultCharges = [
        {name: 'Spotify', amount: 8500},
        {name: 'Pago Casa', amount: 100000},
        {name: 'Pago tarjeta', amount: 100000},
        {name: 'Pago Nacho', amount: 15000},
        {name: 'Pago Mamá', amount: 20000},
        {name: 'Transporte', amount: 30000}
    ];
    
    const defaultHistory = [
        {month: 'Septiembre', income: 360000, expenses: 273500, savings: 86500}
    ];

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    
    let charges = JSON.parse(localStorage.getItem('budget_charges'));
    if (!charges) {
        charges = defaultCharges;
        localStorage.setItem('budget_charges', JSON.stringify(charges));
    }
    
    let history = JSON.parse(localStorage.getItem('budget_history'));
    if (!history) {
        history = defaultHistory;
        localStorage.setItem('budget_history', JSON.stringify(history));
    }

    let selectedMonth = "";

    function init() {
        renderMonths();
        renderCharges();
        renderHistory();
    }

    function renderMonths() {
        const grid = document.getElementById('monthGrid');
        grid.innerHTML = '';
        months.forEach(m => {
            const btn = document.createElement('button');
            btn.className = 'month-btn';
            btn.id = 'btn_' + m;
            btn.textContent = m.substring(0,3);
            btn.onclick = () => selectMonth(m);
            grid.appendChild(btn);
        });
    }

    function renderCharges() {
        const list = document.getElementById('chargesList');
        list.innerHTML = '';
        let total = 0;
        charges.forEach(c => {
            total += c.amount;
            list.innerHTML += \\
                <div class='charge-item'>
                    <span class='charge-name'>\</span>
                    <span class='charge-value'>$\</span>
                    <button class='icon-btn delete' style='padding: 4px 8px; font-size: 12px; margin: 0;' onclick="delCharge('\')">&#10005;</button>
                </div>
            \\;
        });
        document.getElementById('fixedInput').value = total;
    }

    function renderHistory() {
        const tbody = document.getElementById('historyBody');
        tbody.innerHTML = '';
        history.forEach(h => {
            tbody.innerHTML += \\
                <tr>
                    <td>\</td>
                    <td>$\</td>
                    <td>$\</td>
                    <td>$\</td>
                    <td>
                        <button onclick="editarPlan('\', \)" class="icon-btn">Editar</button>
                        <button onclick="borrarPlan('\')" class="icon-btn delete">Borrar</button>
                    </td>
                </tr>
            \\;
        });
    }

    function addCharge() {
        const name = document.getElementById("newChargeName").value.trim();
        const val = parseInt(document.getElementById("newChargeVal").value);
        if (name === "" || isNaN(val)) {
            alert("Por favor ingresa nombre y valor del cargo.");
            return;
        }
        charges.push({name, amount: val});
        localStorage.setItem('budget_charges', JSON.stringify(charges));
        renderCharges();
        document.getElementById("newChargeName").value = '';
        document.getElementById("newChargeVal").value = '';
    }

    function delCharge(name) {
        if(confirm("¿Eliminar el cargo: " + name + "?")) {
            charges = charges.filter(c => c.name !== name);
            localStorage.setItem('budget_charges', JSON.stringify(charges));
            renderCharges();
        }
    }

    function selectMonth(month) {
        selectedMonth = month;
        document.querySelectorAll('.month-btn').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.getElementById("btn_" + month);
        if(activeBtn) activeBtn.classList.add("active");
    }

    function editarPlan(mon, inc) {
        selectMonth(mon);
        document.getElementById("incomeInput").value = inc;
        window.scrollTo(0, 0);
    }

    function borrarPlan(month) {
        if(confirm("¿Estás seguro de que deseas eliminar el registro de " + month + "?")) {
            history = history.filter(h => h.month !== month);
            localStorage.setItem('budget_history', JSON.stringify(history));
            renderHistory();
        }
    }

    function distribuir() {
        if(selectedMonth === "") {
            alert("Por favor selecciona un mes en la cuadrícula");
            return;
        }
        const inc = parseInt(document.getElementById("incomeInput").value);
        if(isNaN(inc)) {
            alert("Por favor ingresa un ingreso total válido");
            return;
        }
        
        let total_expenses = 0;
        charges.forEach(c => total_expenses += c.amount);
        
        let savings = inc - total_expenses;
        if(savings < 0) savings = 0;
        
        const existingIndex = history.findIndex(h => h.month === selectedMonth);
        const newRecord = {month: selectedMonth, income: inc, expenses: total_expenses, savings};
        
        if (existingIndex !== -1) {
            history[existingIndex] = newRecord;
        } else {
            history.push(newRecord);
        }
        
        localStorage.setItem('budget_history', JSON.stringify(history));
        renderHistory();
        document.getElementById("incomeInput").value = '';
    }

    init();
</script>
</body>
</html>
;
fs.writeFileSync('C:/Users/Jeffry/Desktop/PresupuestoWeb/index.html', html, 'utf8');
