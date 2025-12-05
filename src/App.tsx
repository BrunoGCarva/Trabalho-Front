import { useState, useEffect } from "react";
import { TaskModal, type Tarefa } from "./components/TaskModal";
import { ListTasks } from "./components/ListTasks";

type StatusTarefa = "todo" | "doing" | "done"; 
const BASE_URL = `https://pacaro-tarefas.netlify.app/api/Bruno`;

export default function App() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/tasks`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const formatadas = data.map((t: any) => ({
            id: t.id.toString(),
            title: t.title,
            description: t.description,
            status: (
              t.step === "Para fazer"
                ? "todo"
                : t.step === "Em andamento"
                ? "doing"
                : "done"
            ) as StatusTarefa,
          }));
          setTarefas(formatadas);
        }
      })
      .catch((err) => console.error("Erro ao carregar tarefas:", err));
  }, []);

  function abrirModalCriar() {
    setTarefaEditando(null);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa: Tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  async function salvarTarefa(tarefa: Omit<Tarefa, "id"> & { id?: string }) {
    if (!tarefa.title.trim()) {
      alert("Título é obrigatório!");
      return;
    }

    const step =
      tarefa.status === "todo"
        ? "Para fazer"
        : tarefa.status === "doing"
        ? "Em andamento"
        : "Pronto";

    try {
      if (tarefa.id) {
        const resp = await fetch(`${BASE_URL}/tasks/${tarefa.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: tarefa.title, description: tarefa.description, step }),
        });
        if (!resp.ok) throw new Error("Erro ao atualizar tarefa");
      } else {
        const resp = await fetch(`${BASE_URL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: tarefa.title, description: tarefa.description, step }),
        });
        if (!resp.ok) throw new Error("Erro ao criar tarefa");
      }
      setModalAberto(false);
      const data = await fetch(`${BASE_URL}/tasks`).then((res) => res.json());
      const formatadas = data.map((t: any) => ({
        id: t.id.toString(),
        title: t.title,
        description: t.description,
        status: (
          t.step === "Para fazer"
            ? "todo"
            : t.step === "Em andamento"
            ? "doing"
            : "done"
        ) as StatusTarefa,
      }));
      setTarefas(formatadas);
      setTarefas(formatadas);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar tarefa");
    }
  }

  async function moverTarefa(id: string, novoStatus: StatusTarefa) {
    const step =
      novoStatus === "todo" ? "Para fazer" : novoStatus === "doing" ? "Em andamento" : "Pronto";

    try {
      const resp = await fetch(`${BASE_URL}/tasks/${id}/update-step`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });
      if (!resp.ok) throw new Error("Erro ao atualizar step");

      setTarefas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: novoStatus } : t))
      );
    } catch (err) {
      console.error(err);
      alert("Erro ao mover tarefa");
    }
  }

  async function excluirTarefa(id: string) {
    if (!confirm("Deseja realmente excluir esta tarefa?")) return;

    try {
      const resp = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Erro ao deletar tarefa");

      setTarefas((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir tarefa");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">FakeTrello</h1>
        <button
          onClick={abrirModalCriar}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow"
        >
          + Nova Tarefa
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["todo", "doing", "done"].map((status) => (
          <ListTasks
            key={status}
            titulo={status === "todo" ? "A Fazer" : status === "doing" ? "Fazendo" : "Pronto"}
            tarefas={tarefas.filter((t) => t.status === status)}
            editarTarefa={abrirModalEditar}
            moverTarefa={moverTarefa}
            excluirTarefa={excluirTarefa}
          />
        ))}
      </div>

      {modalAberto && (
        <TaskModal
          tarefa={tarefaEditando}
          salvar={salvarTarefa}
          fechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}
