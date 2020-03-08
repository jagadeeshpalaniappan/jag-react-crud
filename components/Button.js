

import React from "react";

const Button = props => {
  let { text, icon, color, type, className, onClick, ...rest } = props;

  const btnType = type || "button";

  let btnBgColor = "text-gray-600 hover:text-teal-500";
  if (color === "primary") {
    btnBgColor = "bg-blue-500 hover:bg-blue-700 text-white";
  } else if (color === "default") {
    btnBgColor = "bg-gray-200 hover:bg-gray-300 text-gray-700";
  }

  return (
    <button
      className={`inline-block ${btnBgColor} px-3 py-1 mr-2 rounded-full ${className}`}
      onClick={onClick}
      type={btnType}
      {...rest}
    >
      <div className="flex items-center">
        {icon && <div className="mr-1">{icon}</div>}
        {text && <div>{text}</div>}
      </div>
    </button>
  );
};

const IconButton = props => {
  let { icon, color, type, className, onClick, ...rest } = props;

  const btnType = type || "button";

  let btnBgColor = "text-gray-600 hover:text-teal-500";
  if (color === "primary") {
    btnBgColor = "text-gray-600 hover:text-blue-500";
  } else if (color === "red") {
    btnBgColor = "text-gray-600 hover:text-red-500";
  }

  return (
    <button
      className={`inline-block ${btnBgColor} mr-2 rounded-full ${className}`}
      onClick={onClick}
      type={btnType}
      {...rest}
    >
      <div>{icon}</div>
    </button>
  );
};

const Anchor = props => {
  let { text, primary, onClick, ...rest } = props;

  const btnBgColor = primary
    ? "bg-blue-500 hover:bg-blue-700 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-700";

  return (
    <a
      className={`inline-block ${btnBgColor} px-3 py-1 mr-2 rounded-full`}
      onClick={onClick}
      {...rest}
    >
      {text}
    </a>
  );
};


export { Button, IconButton, Anchor };