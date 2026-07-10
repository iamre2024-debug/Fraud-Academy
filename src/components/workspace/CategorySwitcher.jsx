export default function CategorySwitcher({ lanes, activeLane, onChange }) {
  return (
    <div className="tabs workspace-category-switcher" role="tablist" aria-label="Investigation categories">
      {lanes.map((lane) => (
        <button
          key={lane.id}
          type="button"
          role="tab"
          aria-selected={activeLane === lane.id}
          className={activeLane === lane.id ? 'active' : ''}
          onClick={() => onChange(lane.id)}
        >
          {lane.label}
        </button>
      ))}
    </div>
  );
}
