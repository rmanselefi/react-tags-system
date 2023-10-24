import { useQuery } from "react-query";

type Tag = {
  name: string;
  category?: string;
  value?: string;
  id: string;
};

type AutoCompleteResult = Tag[];

export function useAutocomplete(query: string) {
  return useQuery<AutoCompleteResult, Error>(["autocomplete", query], () =>
    fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`).then(
      (res) => res.json()
    )
  );
}
