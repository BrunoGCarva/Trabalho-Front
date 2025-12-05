import type { Tarefa } from "./TaskModal";
import { Card } from "./Card";

type StatusTarefa = "todo" | "doing" | "done";

interface Props {
  titulo: string;
  tarefas: Tarefa[];
  editarTarefa: (tarefa: Tarefa) => void;
  excluirTarefa: (id: string) => void;
  moverTarefa: (id: string, novoStatus: StatusTarefa) => void;
}

export function ListTasks({ titulo, tarefas, editarTarefa, excluirTarefa, moverTarefa }: Props) {
  const ordemColunas: StatusTarefa[] = ["todo", "doing", "done"];

  function statusAnterior(status: StatusTarefa): StatusTarefa | null {
    const index = ordemColunas.indexOf(status);
    return index > 0 ? ordemColunas[index - 1] : null;
  }

  function statusProximo(status: StatusTarefa): StatusTarefa | null {
    const index = ordemColunas.indexOf(status);
    return index < ordemColunas.length - 1 ? ordemColunas[index + 1] : null;
  }

  return (
    <div className="bg-gray-200 p-3 rounded-lg shadow">
      <h3 className="font-bold text-lg mb-3">{titulo}</h3>
      {tarefas.length === 0 && <p className="text-gray-500">Nenhuma tarefa</p>}

      {tarefas.map((t) => (
        <Card key={t.id}>
          <div className="font-bold text-gray-800">{t.title}</div>
          <div className="text-gray-600 text-sm">{t.description}</div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => editarTarefa(t)}
              className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded transition"
            >
              ✏️
            </button>
            <button
              onClick={() => excluirTarefa(t.id)}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded transition"
            >
              🗑️
            </button>
            {statusAnterior(t.status) && (
              <button
                onClick={() => moverTarefa(t.id, statusAnterior(t.status)!)}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded transition"
              >
                ←
              </button>
            )}
            {statusProximo(t.status) && (
              <button
                onClick={() => moverTarefa(t.id, statusProximo(t.status)!)}
                className="px-2 py-1 bg-gray-300 hover:bg-gray-400 rounded transition"
              >
                →
              </button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
