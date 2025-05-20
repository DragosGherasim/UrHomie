export const createChangeHandler = <T>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  persistKey?: string
) => (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  const updated = { ...state, [name]: value };
  setState(updated);

  if (persistKey) {
    const { password, ...toPersist } = updated as Record<string, any>;
    sessionStorage.setItem(persistKey, JSON.stringify(toPersist));
  }
};
