export const extractVariables = (text) => {
  const matches = text.match(/{{(.*?)}}/g);
  return matches ? matches.map((v) => v.replace(/[{}]/g, "")) : [];
};

export const generateMessage = (text, variables, senderName, defaultValues) => {
  let result = text;

  Object.keys(variables).forEach((key) => {
    const value = variables[key]?.trim();
    const finalValue = value || defaultValues[key] || "";

    result = result.replaceAll(`{{${key}}}`, finalValue);
  });

  if (senderName) {
    result += `\n${senderName}`;
  }

  return result;
};