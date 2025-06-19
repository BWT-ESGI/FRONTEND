import { Section } from "./sections.type";

export interface Report {
  id: string;
  content: string;
  group: {
    id: string;
    name: string;
  };
  sections: Section[];
}