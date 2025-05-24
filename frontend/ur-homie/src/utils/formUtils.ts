export const createChangeHandler = <T>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>
) => (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  const updated = { ...state, [name]: value };
  setState(updated);
};