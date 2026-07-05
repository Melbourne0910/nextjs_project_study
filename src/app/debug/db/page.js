import { getDatabaseContent } from "./action";

export const metadata = {
  title: "Database Viewer",
  description: "View SQLite database tables and rows for debugging.",
};

export default async function DatabaseViewerPage() {
  let data = {};

  try {
    data = await getDatabaseContent();
  } catch (error) {
    return (
      <p className="p-6 text-red-500">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center">
        🗄️ Database Viewer
      </h1>

      {Object.keys(data).length === 0 ? (
        <p className="text-center text-gray-500">
          No tables found.
        </p>
      ) : (
        Object.entries(data).map(([tableName, rows]) => (
          <div
            key={tableName}
            className="border rounded-lg shadow bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold p-4 bg-gray-100 dark:bg-gray-800 rounded-t-lg">
              {tableName} ({rows.length} rows)
            </h2>

            {rows.length === 0 ? (
              <p className="p-4 text-gray-500">
                No rows in this table.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                      {Object.keys(rows[0]).map((col) => (
                        <th
                          key={col}
                          className="border px-3 py-2 text-left"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-t">
                        {Object.keys(row).map((col) => (
                          <td
                            key={col}
                            className="border px-3 py-2"
                          >
                            {String(row[col] ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
