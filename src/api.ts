import { FormSchema, PaginatedResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = {
  async getFormSchema(): Promise<FormSchema> {
    const response = await fetch(`${API_BASE_URL}/form-schema`);
    if (!response.ok) {
      throw new Error("Failed to fetch form schema");
    }
    return response.json();
  },

  async submitForm(data: Record<string, any>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  async getSubmissions(
    page: number = 1,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    search: string = ""
  ): Promise<PaginatedResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(`${API_BASE_URL}/submissions?${params}`);
    if (!response.ok) {
      throw new Error("Failed to fetch submissions");
    }
    return response.json();
  },

  async updateSubmission(id: string, data: Record<string, any>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },

  async deleteSubmission(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      throw result;
    }

    return result;
  },
};
