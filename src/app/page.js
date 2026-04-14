"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import MessageList from "@/components/MessageList";
import EditModal from "@/components/EditModal";
import { Card, CardContent } from "@/components/ui/card";

import { useMessageApp } from "@/hooks/useMessageApp";
import { generateMessage } from "@/utils/messageUtils";

export default function Home() {
  const app = useMessageApp();

  

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar
        templates={app.filteredTemplates}
        selectedId={app.selectedTemplate?.id}
        onSelect={app.setSelectedTemplate}
        isOpen={app.isSidebarOpen}
        onClose={() => app.setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">

        <Topbar
          setSearch={app.setSearch}
          toggleSidebar={() => app.setIsSidebarOpen(true)}
        />

        <div className="p-6 space-y-4 overflow-y-auto">

          <h2 className="text-2xl font-semibold">
            {app.selectedTemplate?.title}
          </h2>

          <Card>
            <CardContent className="p-6 space-y-4">

              {app.toast && (
                <div className="bg-black text-white px-4 py-2 rounded-lg text-sm w-fit">
                  {app.toast}
                </div>
              )}

              {/* Inputs */}
              {Object.keys(app.variables).map((key) => (
                <input
                  key={key}
                  placeholder={app.placeholders[key] || `Enter ${key}`}
                  value={app.variables[key]}
                  onChange={(e) =>
                    app.setVariables({
                      ...app.variables,
                      [key]: e.target.value,
                    })
                  }
                  className="w-full p-3 border rounded-lg py-4"
                />
              ))}

              <input
                placeholder="Sender name"
                value={app.senderName}
                onChange={(e) => app.setSenderName(e.target.value)}
                className="w-full p-3 border rounded-lg py-4"
              />

              <MessageList
                messages={app.selectedTemplate?.messages || []}
                generateMessage={(text) =>
                  generateMessage(
                    text,
                    app.variables,
                    app.senderName,
                    app.defaultValues
                  )
                }
                handleCopy={(msg) =>
                  app.handleCopy(msg, generateMessage)
                }
                handleEdit={app.handleEdit}
                copiedId={app.copiedId}
              />

            </CardContent>
          </Card>
        </div>
      </div>

      <EditModal
        isOpen={app.isModalOpen}
        tempText={app.tempText}
        setTempText={app.setTempText}
        onClose={() => app.setIsModalOpen(false)}
        onSave={() => {
          app.handleSave(app.editingId);
          app.setIsModalOpen(false);
        }}
        onCopy={() =>
          navigator.clipboard.writeText(
            generateMessage(
              app.tempText,
              app.variables,
              app.senderName,
              app.defaultValues
            )
          )
        }
      />
    </div>
  );
}