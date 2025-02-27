import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaMoon,
  FaSun,
  FaBars,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  TimeScale
);

/* ---------------------------------------------------------------
   SIDEBAR COLAPSÁVEL COM LOGO
------------------------------------------------------------------ */
function Sidebar({ currentPage, setCurrentPage, darkMode, setDarkMode, collapsed, setCollapsed }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg flex flex-col transition-all duration-150 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4 border-b border-gray-700 flex flex-col items-center">
        {/* Logo do sistema */}
        <img
          src="/logo3.png"
          alt="Logo"
          className="h-21 w-21 object-contain mb-2"
        />
        {/* Nome do sistema */}
        {!collapsed && (
          <span className="text-xl font-bold">Miss Finance</span>
        )}
      </div>

      {/* Links de navegação */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setCurrentPage("dashboard")}
          className={`w-full text-left px-3 py-2 rounded transition-colors duration-150 ${
            currentPage === "dashboard"
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FaTasks className="text-xl" />
            {!collapsed && <span>Dashboard</span>}
          </div>
        </button>
        <button
          onClick={() => setCurrentPage("chamados")}
          className={`w-full text-left px-3 py-2 rounded transition-colors duration-150 ${
            currentPage === "chamados"
              ? "bg-gray-700 font-semibold"
              : "hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <FaClock className="text-xl" />
            {!collapsed && <span>Lista de Chamados</span>}
          </div>
        </button>
      </nav>

      {/* Botão para alternar o modo escuro */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-md shadow w-full justify-center"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {!collapsed && (darkMode ? "Modo Claro" : "Modo Escuro")}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   NAVBAR (FILTROS)
------------------------------------------------------------------ */
function Navbar({
  statusFilter,
  setStatusFilter,
  atendenteFilter,
  setAtendenteFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  statusCounts,
  atendentes,
}) {
  return (
    <nav className="flex items-center justify-start bg-gray-1000 p-4 mb-4 text-white">
      <div className="mr-4">
        <label className="mr-2 font-semibold">Status:</label>
        <select
          className="p-2 text-black rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Todos</option>
          {Object.keys(statusCounts).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="mr-4">
        <label className="mr-2 font-semibold">Atendente:</label>
        <select
          className="p-2 text-black rounded"
          value={atendenteFilter}
          onChange={(e) => setAtendenteFilter(e.target.value)}
        >
          <option value="Todos">Todos</option>
          {atendentes.map((atendente) => (
            <option key={atendente} value={atendente}>
              {atendente}
            </option>
          ))}
        </select>
      </div>

      <div className="mr-4">
        <label className="mr-2 font-semibold">Data Inicial:</label>
        <input
          type="date"
          className="p-2 text-black rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label className="mr-2 font-semibold">Data Final:</label>
        <input
          type="date"
          className="p-2 text-black rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------
   PÁGINA: DASHBOARD
------------------------------------------------------------------ */
function DashboardPage({
  filteredChamados,
  statusCounts,
  atendenteCounts,
  topAtendentesLabels,
  topAtendentesCounts,
  chamadosPorTipo,
}) {
  return (
    <div className="px-4">
      {/* Cartões de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: <FaTasks />,
            label: "Total de Chamados",
            value: filteredChamados.length,
          },
          {
            icon: <FaClock />,
            label: "Em Aberto",
            value: statusCounts["Aberto"] || 0,
          },
          {
            icon: <FaCheckCircle />,
            label: "Resolvidos",
            value: statusCounts["Resolvido"] || 0,
          },
          {
            icon: <FaUsers />,
            label: "Atendentes Ativos",
            value: Object.keys(atendenteCounts).length,
          },
        ].map((card, index) => (
          <div
            key={index}
            className="relative flex flex-row items-center justify-between rounded-xl border border-gray-300 dark:border-gray-600 shadow-md p-6 transition-colors duration-300 bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-500 p-3 text-white text-2xl">
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {card.label}
                </p>
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {card.value}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-lg shadow-md transition-colors duration-300 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Chamados por Status
          </h2>
          <Bar
            data={{
              labels: Object.keys(statusCounts),
              datasets: [
                {
                  label: "Chamados",
                  data: Object.values(statusCounts),
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            }}
          />
        </div>

        <div className="p-4 rounded-lg shadow-md transition-colors duration-300 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
            Evolução dos Chamados
          </h2>
          <Line
            data={{
              labels: Object.keys(statusCounts),
              datasets: [
                {
                  label: "Abertos",
                  data: Object.values(statusCounts),
                  borderColor: "#FF6384",
                  fill: false,
                },
                {
                  label: "Resolvidos",
                  data: Object.values(statusCounts),
                  borderColor: "#36A2EB",
                  fill: false,
                },
                {
                  label: "Encerrados",
                  data: Object.values(statusCounts),
                  borderColor: "#FFCE56",
                  fill: false,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* Gráfico: Top 10 Atendentes com Chamados Resolvidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-lg shadow-md transition-colors duration-300 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Top 10 Atendentes - Chamados Resolvidos
        </h2>
        <Bar
          data={{
            labels: topAtendentesLabels,
            datasets: [
              {
                label: "Chamados Resolvidos",
                data: topAtendentesCounts,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
      </div>

      {/* Novo gráfico: Chamados por Tipo (prefixo do número) */}
      <div className="p-4 rounded-lg shadow-md transition-colors duration-300 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-600">
      <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Chamados por Tipo (Prefixo do Número)
        </h2>
        <Bar
          data={{
            labels: Object.keys(chamadosPorTipo),
            datasets: [
              {
                label: "Chamados",
                data: Object.values(chamadosPorTipo),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                },
              },
            },
          }}
        />
        </div>
      </div>   
    </div>
  );
}

/* ---------------------------------------------------------------
   PÁGINA: LISTA DE CHAMADOS
------------------------------------------------------------------ */
function ChamadosPage({ filteredChamados }) {
  return (
    <div className="px-4">
      <div className="shadow-md rounded-lg p-4 transition-colors duration-300 bg-gray-100 dark:bg-gray-800 dark:border dark:border-gray-600">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Lista de Chamados
        </h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">ID</th>
              <th className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">Número</th>
              <th className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">Status</th>
              <th className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">Atendente</th>
              <th className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {filteredChamados.map((chamado) => (
              <tr key={chamado.ticket_id} className="text-center">
                <td className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">
                  {chamado.ticket_id}
                </td>
                <td className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">
                  {chamado.number}
                </td>
                <td className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">
                  {chamado.status}
                </td>
                <td className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">
                  {chamado.atendente || "N/A"}
                </td>
                <td className="border p-2 dark:border-gray-600 text-gray-800 dark:text-white">
                  {new Date(chamado.created).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ---------------------------------------------------------------
   COMPONENTE PRINCIPAL (APP)
------------------------------------------------------------------ */
function App() {
  // Estados de dados e filtros
  const [chamados, setChamados] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [atendenteFilter, setAtendenteFilter] = useState("Todos");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredChamados, setFilteredChamados] = useState([]);

  // Estado para página atual e dark mode
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode !== null
      ? JSON.parse(savedMode)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Estado para sidebar colapsada (passado para Sidebar e para ajustar o margin)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Busca dos chamados
  useEffect(() => {
    fetch("http://localhost:5000/chamados")
      .then((res) => res.json())
      .then((data) => {
        setChamados(data);
        setFilteredChamados(data);
      })
      .catch((err) => console.error("Erro ao buscar chamados", err));
  }, []);

  // Aplica filtros
  useEffect(() => {
    let filtered = chamados;
    if (statusFilter !== "Todos") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    if (atendenteFilter !== "Todos") {
      filtered = filtered.filter((c) => c.atendente === atendenteFilter);
    }
    if (startDate && endDate) {
      filtered = filtered.filter((c) => {
        const chamadoDate = new Date(c.created);
        return (
          chamadoDate >= new Date(startDate) &&
          chamadoDate <= new Date(endDate)
        );
      });
    }
    setFilteredChamados(filtered);
  }, [statusFilter, atendenteFilter, startDate, endDate, chamados]);

  // Contagens por Status
  const statusCounts = filteredChamados.reduce((acc, chamado) => {
    if (["Aberto", "Resolvido", "Encerrado"].includes(chamado.status)) {
      acc[chamado.status] = (acc[chamado.status] || 0) + 1;
    }
    return acc;
  }, {});

  // Contagens por Atendente
  const atendenteCounts = filteredChamados.reduce((acc, chamado) => {
    if (chamado.atendente) {
      acc[chamado.atendente] = (acc[chamado.atendente] || 0) + 1;
    }
    return acc;
  }, {});

  const atendentes = [
    ...new Set(chamados.map((chamado) => chamado.atendente).filter(Boolean)),
  ];

  // Lógica para Top 10 Atendentes com chamados resolvidos
  const resolvedAtendenteCounts = filteredChamados.reduce((acc, chamado) => {
    if (chamado.status === "Resolvido" && chamado.atendente) {
      acc[chamado.atendente] = (acc[chamado.atendente] || 0) + 1;
    }
    return acc;
  }, {});

  const top10Atendentes = Object.entries(resolvedAtendenteCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const topAtendentesLabels = top10Atendentes.map(([atendente]) => atendente);
  const topAtendentesCounts = top10Atendentes.map(([, count]) => count);

  // Lógica para separar chamados por tipo, de acordo com o prefixo do "Número"
  const chamadosPorTipo = filteredChamados.reduce((acc, chamado) => {
    let prefix = "";
    if (chamado.number.startsWith("BX")) {
      prefix = "BX";
    } else if (chamado.number.startsWith("EST")) {
      prefix = "EST";
    } else if (chamado.number.toLowerCase().startsWith("pagar")) {
      prefix = "pagar";
    } else {
      prefix = "Outros";
    }
    acc[prefix] = (acc[prefix] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen w-full m-0 p-0 from-gray-800 via-gray-900 to-black transition-colors duration-300">
      {/* Sidebar fixa */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Conteúdo principal com margin adaptável */}
      <div className={`${sidebarCollapsed ? "ml-100" : "ml-64"} transition-all duration-300`}>
        <Navbar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          atendenteFilter={atendenteFilter}
          setAtendenteFilter={setAtendenteFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          statusCounts={statusCounts}
          atendentes={atendentes}
        />

        {currentPage === "dashboard" ? (
          <DashboardPage
            filteredChamados={filteredChamados}
            statusCounts={statusCounts}
            atendenteCounts={atendenteCounts}
            topAtendentesLabels={topAtendentesLabels}
            topAtendentesCounts={topAtendentesCounts}
            chamadosPorTipo={chamadosPorTipo}
          />
        ) : (
          <ChamadosPage filteredChamados={filteredChamados} />
        )}
      </div>
    </div>
  );
}

export default App;
