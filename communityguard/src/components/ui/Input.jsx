// src/components/ui/Input.jsx
export function Input({ type = "text", value, onChange, placeholder, className }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border p-2 rounded-lg w-full ${className}`}
      />
    );
  }
  