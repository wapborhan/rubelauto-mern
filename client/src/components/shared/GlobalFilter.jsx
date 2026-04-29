import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

const GlobalFilter = ({ filters, setFilters }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  return (
    <div className="flex w-full">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search"> </InputIcon>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Keyword Search"
          className="input input-border border-2 pl-10 border-slate-200 w-full"
        />
      </IconField>
    </div>
  );
};

export default GlobalFilter;
