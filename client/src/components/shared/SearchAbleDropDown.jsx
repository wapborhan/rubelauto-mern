const SearchAbleDropDown = (props) => {
  const {
    state,
    setState,
    data = [],
    config = {},
    disable = false,
    requir = false,
    className = "",
  } = props;

  const labelKey = config.optLabel || "name";
  const placeholder = config.placeHolder || "নির্বাচন করুন";

  const handleChange = (e) => {
    const val = e.target.value;
    if (!val) {
      setState(null);
      return;
    }
    const found = data.find(
      (item, idx) =>
        (item._id || item.id || item.code || item.sku || item[labelKey] || idx).toString() === val
    );
    setState(found || null);
  };

  const selectedValue = state
    ? (state._id || state.id || state.code || state.sku || state[labelKey] || "").toString()
    : "";

  return (
    <select
      value={selectedValue}
      onChange={handleChange}
      disabled={disable}
      required={requir}
      className={`w-full px-3.5 py-2 text-sm bg-gray-50/50 border border-gray-300 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    >
      <option value="">{placeholder}</option>
      {(data || []).map((item, index) => {
        const val = (
          item._id ||
          item.id ||
          item.code ||
          item.sku ||
          item[labelKey] ||
          index
        ).toString();
        const displayLabel = item[labelKey] || item.name || item.label || val;
        return (
          <option key={val + "-" + index} value={val}>
            {displayLabel}
          </option>
        );
      })}
    </select>
  );
};

export default SearchAbleDropDown;
