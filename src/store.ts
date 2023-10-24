import { create } from "zustand";

type Tag = {
  name: string;
  category?: string;
  value?: string;
  id: string;
};

type TagState = {
  tags: Tag[];
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
};

const useTagsStore = create<TagState>((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  removeTag: (id) =>
    set((state) => {
      const newTags = state.tags.filter((tag) => tag.id !== id);
      return { tags: newTags };
    }),
}));

export default useTagsStore;
