import React, { useState } from "react";
import { Category, SubCategory, TaskTemplate } from "../types";
import { Dialog } from "./ui/Dialog";
import { Plus, Trash2, X } from "./ui/Icons";

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  taskTemplates: { [subCategoryId: string]: TaskTemplate[] };
  onUpdateTaskTemplates: (taskTemplates: { [subCategoryId: string]: TaskTemplate[] }) => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  categories,
  onUpdateCategories,
  taskTemplates,
  onUpdateTaskTemplates,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#64748b");
  const [newSubCategoryNames, setNewSubCategoryNames] = useState<{ [key: string]: string }>({});
  const [newTaskTemplateContents, setNewTaskTemplateContents] = useState<{ [key: string]: string }>({});

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      name: newCategoryName,
      color: newCategoryColor,
      subCategories: [],
    };
    onUpdateCategories([...categories, newCategory]);
    setNewCategoryName("");
    setNewCategoryColor("#64748b");
  };

  const handleDeleteCategory = (categoryId: string) => {
    onUpdateCategories(categories.filter((c) => c.id !== categoryId));
  };

  const handleAddSubCategory = (categoryId: string) => {
    const subCategoryName = newSubCategoryNames[categoryId];
    if (!subCategoryName || !subCategoryName.trim()) return;

    const newSubCategory: SubCategory = {
      id: `sub-${Date.now()}`,
      name: subCategoryName,
    };

    const updatedCategories = categories.map((c) => {
      if (c.id === categoryId) {
        return { ...c, subCategories: [...c.subCategories, newSubCategory] };
      }
      return c;
    });
    onUpdateCategories(updatedCategories);

    setNewSubCategoryNames({ ...newSubCategoryNames, [categoryId]: "" });
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    const updatedCategories = categories.map((c) => {
      if (c.id === categoryId) {
        return { ...c, subCategories: c.subCategories.filter((sc) => sc.id !== subCategoryId) };
      }
      return c;
    });
    onUpdateCategories(updatedCategories);
  };

  const handleAddTaskTemplate = (subCategoryId: string) => {
    const content = newTaskTemplateContents[subCategoryId];
    if (!content || !content.trim()) return;

    const newTemplate: TaskTemplate = {
      id: `tt-${Date.now()}`,
      content,
    };

    const newTemplatesForSubCategory = [...(taskTemplates[subCategoryId] || []), newTemplate];
    onUpdateTaskTemplates({ ...taskTemplates, [subCategoryId]: newTemplatesForSubCategory });
    setNewTaskTemplateContents({ ...newTaskTemplateContents, [subCategoryId]: "" });
  };

  const handleDeleteTaskTemplate = (subCategoryId: string, templateId: string) => {
    const updatedTemplates = (taskTemplates[subCategoryId] || []).filter((t) => t.id !== templateId);
    onUpdateTaskTemplates({ ...taskTemplates, [subCategoryId]: updatedTemplates });
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="카테고리 및 태스크 관리" widthClass="sm:max-w-2xl">
      <div className="space-y-6">
        {/* Add new category form */}
        <div className="p-4 border rounded-lg">
          <h4 className="text-lg font-medium mb-2">새 카테고리 추가</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              placeholder="카테고리 이름"
              className="flex-grow p-2 border rounded-md"
            />
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none"
              />
              <button
                onClick={handleAddCategory}
                className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Existing categories list */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {categories.map((category) => (
            <div key={category.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: category.color }}></div>
                  <span className="font-semibold text-lg">{category.name}</span>
                </div>
                <button onClick={() => handleDeleteCategory(category.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="pl-6 space-y-2">
                {category.subCategories.map((sub) => (
                  <div key={sub.id} className="flex justify-between items-center text-sm">
                    <span>- {sub.name}</span>
                    <button
                      onClick={() => handleDeleteSubCategory(category.id, sub.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newSubCategoryNames[category.id] || ""}
                    onChange={(e) => setNewSubCategoryNames({ ...newSubCategoryNames, [category.id]: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSubCategory(category.id)}
                    placeholder="하위 카테고리 추가"
                    className="flex-grow p-1 border text-sm rounded-md"
                  />
                  <button
                    onClick={() => handleAddSubCategory(category.id)}
                    className="p-1.5 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {category.name === "업무" && category.subCategories.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-semibold mb-2 text-gray-700">업무별 사전 정의 태스크</h5>
                  {category.subCategories.map((sub) => (
                    <div key={sub.id} className="pl-6 mt-2">
                      <p className="font-medium text-sm text-gray-600 mb-1">{sub.name}</p>
                      <div className="pl-2 space-y-1">
                        {(taskTemplates[sub.id] || []).map((template) => (
                          <div key={template.id} className="flex justify-between items-center text-sm text-gray-800">
                            <span>- {template.content}</span>
                            <button
                              onClick={() => handleDeleteTaskTemplate(sub.id, template.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-2 pl-2">
                        <input
                          type="text"
                          value={newTaskTemplateContents[sub.id] || ""}
                          onChange={(e) =>
                            setNewTaskTemplateContents({ ...newTaskTemplateContents, [sub.id]: e.target.value })
                          }
                          onKeyDown={(e) => e.key === "Enter" && handleAddTaskTemplate(sub.id)}
                          placeholder="새 태스크 템플릿"
                          className="flex-grow p-1 border text-sm rounded-md"
                        />
                        <button
                          onClick={() => handleAddTaskTemplate(sub.id)}
                          className="p-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};
