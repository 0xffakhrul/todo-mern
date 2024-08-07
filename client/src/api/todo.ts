// import { useQueries } from "@tanstack/react-query";
// import { getTodo } from "./request";

// export function fetchTodos(userId: (string | undefined)[] | undefined) {
//   return useQueries({
//     queries: (userId ?? []).map((id) => {
//       return {
//         queryKey: ["todo", id],
//         queryFn: () => getTodo(id!),
//       };
//     }),
//   });
// }
