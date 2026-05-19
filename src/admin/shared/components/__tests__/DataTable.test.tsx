import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable } from "../DataTable";

type Row = { id: string; name: string; age: number };

const columns = [
  { key: "name" as const, header: "Name", render: (row: Row) => row.name },
  { key: "age" as const, header: "Age", render: (row: Row) => String(row.age) },
];

const rows: Row[] = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<DataTable columns={columns} rows={rows} rowKey="id" />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows empty message when no rows", () => {
    render(
      <DataTable columns={columns} rows={[]} rowKey="id" emptyMessage="No data found" />
    );
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });
});
