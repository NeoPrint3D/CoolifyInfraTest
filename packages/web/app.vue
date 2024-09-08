<template>
  <div
    class="bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen flex flex-col justify-center items-center p-8"
  >
    <Toaster />
    <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-6">Todos</h1>

      <ul class="space-y-3 mb-6">
        <li
          v-for="todo in todos"
          :key="todo.id"
          class="p-4 bg-gray-50 text-black rounded-lg shadow-md transition-all hover:shadow-lg items-center flex gap-3"
        >
          <Checkbox
            :modelValue="todo.status === 'completed'"
            @update:modelValue="() => toggleStatus(todo)"
            binary
          />
          <span :class="{ 'line-through': todo.status === 'completed' }">
            {{ todo.title }}
          </span>

          <span class="text-xs text-gray-500 ml-auto">
            {{ formatDate(todo.createdAt) }}
          </span>

          <Button
            @click="() => deleteTodo(todo)"
            size="small"
            severity="danger"
          >
            Delete
          </Button>
        </li>
      </ul>

      <form class="flex flex-col gap-4" @submit.prevent="addTodo">
        <InputText
          v-model="title"
          placeholder="Enter your todo"
          class="p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button type="submit" :disabled="!title.trim()"> Add Todo </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { todosTable } from "database";
import { toast, Toaster } from "vue-sonner";
import { client } from "~/lib/hono";

const title = shallowRef("");

const {
  data: todos,
  status,
  refresh,
} = await useAsyncData("todos", async () => {
  try {
    const response = await client.todo.$get();
    const data = await response.json();
    return data.todos as unknown as (typeof todosTable.$inferSelect)[];
  } catch (error) {
    toast.error("Failed to fetch todos");
    return [];
  }
});

async function addTodo() {
  if (!title.value.trim()) return;

  toast.promise(
    async () => {
      const res = await client.todo.$post({
        json: {
          action: "create",
          data: { title: title.value.trim() },
        },
      });

      await refresh();
      return await res.json();
    },
    {
      loading: "Adding todo...",
      success: (res) => res.message,
      error: (res) => res.message,
    }
  );

  title.value = "";
}

async function toggleStatus(todo: typeof todosTable.$inferSelect) {
  toast.promise(
    async () => {
      const res = await client.todo[":id"].$put({
        json: {
          action: "toggle",
          data: {
            status: todo.status === "completed" ? "incomplete" : "completed",
          },
        },
        param: { id: todo.id },
      });
      await refresh();

      return await res.json();
    },
    {
      loading: "Updating todo status...",
      success: (res) => res.message,
      error: (res) => res.message,
    }
  );
}

async function deleteTodo(todo: typeof todosTable.$inferSelect) {
  toast.promise(
    async () => {
      const res = await client.todo[":id"].$delete({
        param: { id: todo.id },
      });
      await refresh();

      return await res.json();
    },
    {
      loading: "Deleting todo...",
      success: (res) => res.message,
      error: (res) => res.message,
    }
  );
}

function formatDate(date: string | number | Date) {
  return new Date(date).toLocaleString();
}
</script>
