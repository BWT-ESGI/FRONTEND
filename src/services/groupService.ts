
export type User = { id: string; name: string };
export type Group = { id: string; name: string; members: User[] };

export const fetchMockGroupBuilderData = async (): Promise<{
  users: User[];
  groups: Group[];
}> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        users: [
          { id: "u1", name: "Alice" },
          { id: "u2", name: "Bob" },
          { id: "u3", name: "Charlie" },
          { id: "u4", name: "David" },
        ],
        groups: [
          { id: "g1", name: "Groupe A", members: [] },
          { id: "g2", name: "Groupe B", members: [] },
          { id: "g3", name: "Groupe C", members: [] },
        ],
      });
    }, 500);
  });
};