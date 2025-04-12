
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
          { id: "g4", name: "Groupe D", members: [] },
          { id: "g5", name: "Groupe E", members: [] },
          { id: "g6", name: "Groupe F", members: [] },
          { id: "g7", name: "Groupe G", members: [] },
          { id: "g8", name: "Groupe H", members: [] },
          { id: "g9", name: "Groupe I", members: [] },
          { id: "g10", name: "Groupe J", members: [] },
          { id: "g11", name: "Groupe K", members: [] },
          { id: "g12", name: "Groupe L", members: [] },
          { id: "g13", name: "Groupe M", members: [] },
          { id: "g14", name: "Groupe N", members: [] },
          { id: "g15", name: "Groupe O", members: [] },
          { id: "g16", name: "Groupe P", members: [] },
        ],
      });
    }, 500);
  });
};