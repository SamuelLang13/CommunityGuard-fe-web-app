// src/components/ui/Textarea.jsx
export function Textarea({ value, onChange, placeholder, className }) {
    return (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border p-2 rounded-lg w-full ${className}`}
      />
    );
  }
  