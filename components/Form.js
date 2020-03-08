

import React from "react";

const FormInput = props => {
  let { id, label, text, isEditMode, onTextChange } = props;

  return (
    <>
      <label
        class="block uppercase tracking-wide text-gray-700 font-normal text-xs mt-3 mb-2"
        htmlFor="inlineEditInput"
      >
        {label}
      </label>

      <input
        id={`inlineEditInput-${id}`}
        class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        type="text"
        value={text}
        onChange={e => onTextChange(e.target.value)}
      />
    </>
  );
};

export { FormInput };