"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import templatesData from "@/data/templates";
import { Copy, Check, Pencil, Save } from "lucide-react";

export default function Home() {
  const [templatesList, setTemplatesList] = useState(templatesData);
  const [selectedTemplate, setSelectedTemplate] = useState(templatesData[0]);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [tempText, setTempText] = useState("");

  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState("");

  const [variables, setVariables] = useState({});
  const [senderName, setSenderName] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const placeholders = {
    name: "Enter Client Name",
    url: "Enter Website URL",
  };

  const defaultValues = {
    name: "there",
    url: "Enter URL",
  };

  // 🔍 Filter
  const filteredTemplates = templatesList.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  // 🔁 Extract variables
  const extractVariables = (text) => {
    const matches = text.match(/{{(.*?)}}/g);
    return matches ? matches.map((v) => v.replace(/[{}]/g, "")) : [];
  };

  // ⚡ Initialize variables when template changes
  useEffect(() => {
    if (selectedTemplate) {
      const allText = selectedTemplate.messages.map((m) => m.content).join(" ");
      const vars = extractVariables(allText);
      const obj = {};
      vars.forEach((v) => (obj[v] = ""));
      setVariables(obj);
    }
  }, [selectedTemplate]);

  useEffect(() => {
  document.body.style.overflow = isModalOpen ? "hidden" : "auto";
}, [isModalOpen]);

  // // 💾 LocalStorage
  // useEffect(() => {
  //   const stored = localStorage.getItem("templates");
  //   if (stored) {
  //     const parsed = JSON.parse(stored);
  //     setTemplatesList(parsed);
  //     setSelectedTemplate(parsed[0]);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem("templates", JSON.stringify(templatesList));
  // }, [templatesList]);

  // 🧠 Generate message
  const generateMessage = (text) => {
    let result = text;

    Object.keys(variables).forEach((key) => {
      const value = variables[key]?.trim();

      const finalValue =
        value || defaultValues[key] || "";

      result = result.replaceAll(`{{${key}}}`, finalValue);
    });

    if (senderName) {
      result += `\n${senderName}`;
    }

    return result;
  };

  // 📋 Copy
 const handleCopy = (msg) => {
  const text =
    editingId === msg.id ? tempText : msg.content;

  navigator.clipboard.writeText(generateMessage(text));

  setCopiedId(msg.id);
  setTimeout(() => setCopiedId(null), 1500);
};

  // ✏️ Edit
 const handleEdit = (msg) => {
  setEditingId(msg.id);
  setTempText(msg.content);
  setIsModalOpen(true);
};

  // 💾 Save
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

    const updatedTemplate = updated.find((t) => t.id === selectedTemplate.id);
    setSelectedTemplate(updatedTemplate);

    setEditingId(null);
    setToast("Saved successfully");

    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="flex">
      <Sidebar
        templates={filteredTemplates}
        selectedId={selectedTemplate?.id}
        onSelect={(t) => setSelectedTemplate(t)}
      />

      <div className="flex-1 flex flex-col">
        <Topbar setSearch={setSearch} />

        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">
            {selectedTemplate?.title}
          </h2>

          <Card>
            <CardContent className="p-6 space-y-4">

              {/* 🔔 Toast */}
              {toast && (
                <div className="bg-black text-white px-4 py-2 rounded-lg text-sm w-fit animate-fade-in">
                  {toast}
                </div>
              )}

              {/* 💬 Messages */}
              <div className="space-y-3">
                {/* ⚡ Variables */}
                <div className="space-y-2">
                  {Object.keys(variables).map((key) => (
                    <input
                      key={key}
                      placeholder={placeholders[key] || `Enter ${key}`}
                      value={variables[key]}
                      onChange={(e) =>
                        setVariables({ ...variables, [key]: e.target.value })
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  ))}
                </div>

                {/* ✍️ Sender Name */}
                <input
                  placeholder="Sender name (optional)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
                {selectedTemplate?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 border rounded-xl bg-white hover:shadow-sm transition space-y-3"
                  >
                    {/* Content */}
                    {editingId === msg.id ? (
                      <p className="text-gray-700 whitespace-pre-line">
                        {generateMessage(msg.content)}
                      </p>
                    ) : (
                      <p className="text-gray-700 whitespace-pre-line">
                        {generateMessage(msg.content)}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">

                      {/* Copy */}
                      <button
                        onClick={() => handleCopy(msg)}
                        className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100 transition"
                      >
                        {copiedId === msg.id ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}
                        {copiedId === msg.id ? "Copied" : "Copy"}
                      </button>

                      {/* Edit / Save */}
                      {editingId === msg.id ? (
                        <button
                          onClick={() => handleEdit(msg)}
                          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(msg)}
                          className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-gray-100"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>
                      )}

                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
    
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-6 space-y-4 animate-fade-in">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit Message</h2>
        <button onClick={() => setIsModalOpen(false)}>✕</button>
      </div>

      {/* Textarea */}
      <textarea
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        className="w-full h-[80vh] p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10"
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3">

        <button
          onClick={() => {
            navigator.clipboard.writeText(generateMessage(tempText));
            setToast("Copied");
            setTimeout(() => setToast(""), 1500);
          }}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Copy
        </button>

        <button
          onClick={() => {
            handleSave(editingId);
            setIsModalOpen(false);
          }}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          Save
        </button>

      </div>
    </div>
  </div>
)}
    </div>
  );
}