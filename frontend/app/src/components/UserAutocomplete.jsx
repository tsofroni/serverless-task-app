import { useMemo, useState } from "react";
import { teamMembers } from "../data/teamMembers";

export default function UserAutocomplete({
  label,
  value,
  onChange,
  placeholder = "Search user...",
  readOnly = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const suggestions = useMemo(() => {
    const search = value.trim().toLowerCase();

    if (!search) return teamMembers;

    return teamMembers.filter((member) => {
      return (
        member.name.toLowerCase().includes(search) ||
        member.email.toLowerCase().includes(search)
      );
    });
  }, [value]);

  function selectUser(member) {
    onChange(member.email);
    setIsOpen(false);
  }

  return (
    <label className="user-autocomplete">
      {label}

      <input
        type="text"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => !readOnly && setIsOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setIsOpen(false), 150);
        }}
      />

      {!readOnly && isOpen && suggestions.length > 0 && (
        <div className="user-suggestions">
          {suggestions.map((member) => (
            <button
              key={member.email}
              type="button"
              className="user-suggestion"
              onMouseDown={() => selectUser(member)}
            >
              <span className="user-suggestion-avatar">
                {member.name.charAt(0).toUpperCase()}
              </span>

              <span>
                <strong>{member.name}</strong>
                <small>{member.email}</small>
              </span>
            </button>
          ))}
        </div>
      )}
    </label>
  );
}