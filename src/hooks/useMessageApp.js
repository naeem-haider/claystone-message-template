import { useState, useEffect } from "react";
import templatesData from "@/data/templates";
import { extractVariables } from "@/utils/messageUtils";

export const useMessageApp = () => {
  const [templatesList, setTemplatesList] = useState(templatesData);
  const [selectedTemplate, setSelectedTemplate] = useState(templatesData[0]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [tempText, setTempText] = useState("");

  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [variables, setVariables] = useState({});
  const [senderName, setSenderName] = useState("");

  const placeholders = {
    name: "Enter Client Name",
    url: "Enter Website URL",
  };

  const defaultValues = {
    name: "there",
    url: "",
  };

  const filteredTemplates = templatesList.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!selectedTemplate) return;

    const allText = selectedTemplate.messages.map((m) => m.content).join(" ");
    const vars = extractVariables(allText);

    const obj = {};
    vars.forEach((v) => (obj[v] = ""));
    setVariables(obj);
  }, [selectedTemplate]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
  }, [isModalOpen]);

  const handleCopy = (msg, generateMessage) => {
    const text =
      editingId === msg.id ? tempText : msg.content;

    navigator.clipboard.writeText(
      generateMessage(text, variables, senderName, defaultValues)
    );

    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleEdit = (msg) => {
    setEditingId(msg.id);
    setTempText(msg.content);
    setIsModalOpen(true);
  };

  const handleSave = (msgId) => {
    const updated = templatesList.map((t) => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          messages: t.messages.map((m) =>
            m.id === msgId ? { ...m, content: tempText } : m
          ),
        };
      }
      return t;
    });

    setTemplatesList(updated);
    setSelectedTemplate(updated.find((t) => t.id === selectedTemplate.id));

    setToast("Saved successfully");
    setTimeout(() => setToast(""), 2000);
  };

  return {
    // state
    filteredTemplates,
    selectedTemplate,
    search,
    setSearch,

    variables,
    setVariables,
    senderName,
    setSenderName,

    copiedId,
    toast,

    isSidebarOpen,
    setIsSidebarOpen,

    isModalOpen,
    setIsModalOpen,

    editingId,
    tempText,
    setTempText,

    placeholders,
    defaultValues,

    // actions
    setSelectedTemplate,
    handleCopy,
    handleEdit,
    handleSave,
  };
};