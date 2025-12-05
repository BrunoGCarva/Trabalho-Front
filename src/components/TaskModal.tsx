import { useState, useEffect } from "react";

type StatusTarefa = "todo" | "doing" | "done";

export type Tarefa = {
  id: string;
  title: string;
  description: string;
  status: StatusTarefa;
};

interface Props {
  tarefa?: Tarefa | null;
  salvar: (tarefa: Omit<Tarefa, "id"> & { id?: string }) => void;
  fechar: () => void;
}

export function TaskModal({ tarefa, salvar, fechar }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<StatusTarefa>("todo");

  useEffect(() => {
    if (tarefa) {
      setTitle(tarefa.title);
      setDescription(tarefa.description);
      setStatus(tarefa.status);
    }
  }, [tarefa]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    salvar({ id: tarefa?.id, title, description, status });
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        className="bg-white p-6 rounded-xl shadow-xl w-96 space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800">{tarefa ? "Editar" : "Adicionar"} Tarefa</h2>

        <input
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusTarefa)}
        >
          <option value="todo">A Fazer</option>
          <option value="doing">Fazendo</option>
          <option value="done">Concluído</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={fechar}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
