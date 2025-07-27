"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Event, Category, User, Task, TaskTemplate } from "@/types";
import * as api from "@/lib/api";
import { ChevronLeft, ChevronRight, Plus, Settings, GoogleIcon } from "@/components/ui/Icons";
import { EventModal } from "@/components/EventModal";
import { AdminSettingsModal } from "@/components/AdminSettingsModal";
import { KanbanModal } from "@/components/KanbanModal";
import { LoginPromptModal } from "@/components/LoginPromptModal";

const CalendarPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [kanbanTasks, setKanbanTasks] = useState<{ [eventId: string]: Task[] }>({});
  const [taskTemplates, setTaskTemplates] = useState<{ [subCategoryId: string]: TaskTemplate[] }>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isKanbanModalOpen, setIsKanbanModalOpen] = useState(false);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const loadDataForUser = useCallback(async () => {
    try {
      const [loadedEvents, loadedCategories, loadedTemplates] = await Promise.all([
        api.apiGetEvents(),
        api.apiGetCategories(),
        api.apiGetTaskTemplates(),
      ]);
      setEvents(loadedEvents);
      setCategories(loadedCategories);
      setTaskTemplates(loadedTemplates);
      setKanbanTasks({}); // Reset tasks, they will be fetched on demand
    } catch (error) {
      console.error("Failed to load user data", error);
      if (error instanceof Error && error.message.includes('401')) {
        // Handle unauthorized access gracefully
        handleLogout();
      } else {
        alert("데이터를 불러오는 데 실패했습니다.");
      }
    }
  }, []);

  useEffect(() => {
    const checkCurrentUser = async () => {
      setIsLoading(true);
      try {
        // Check for auth error from redirect
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("error")) {
          setAuthError("Google 로그인에 실패했습니다. 다시 시도해주세요.");
          // Clean up the URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }

        const user = await api.apiGetCurrentUser();
        setCurrentUser(user);
        if (user) {
          await loadDataForUser();
        }
      } catch (error) {
        console.error("Failed to check current user", error);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkCurrentUser();
  }, [loadDataForUser]);

  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);

  const daysInMonth = useMemo(() => {
    const days = [];
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    for (let i = 0; i < 42; i++) {
      days.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return days;
  }, [firstDayOfMonth]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleLogin = () => {
    // Redirect to backend for Google OAuth
    window.location.href = `/api/auth/google`;
  };

  const handleLogout = async () => {
    try {
      await api.apiLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setCurrentUser(null);
      setEvents([]);
      setCategories([]);
      setKanbanTasks({});
      setTaskTemplates({});
    }
  };

  const handleDayClick = (day: Date) => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
      return;
    }
    setSelectedDate(day);
    setSelectedEvent(null);
    setIsEventModalOpen(true);
  };

  const handleEventClick = async (event: Event) => {
    if (!currentUser) return;
    const category = categories.find((c) => c.id === event.categoryId);
    if (category?.name === "업무" && event.subCategoryId) {
      setSelectedEvent(event);
      if (!kanbanTasks[event.id]) {
        try {
          const tasks = await api.apiGetTasksForEvent(event.id);
          setKanbanTasks((prev) => ({ ...prev, [event.id]: tasks }));
        } catch (error) {
          console.error("Failed to fetch tasks for event:", error);
          alert("태스크 정보를 불러오는데 실패했습니다.");
          return;
        }
      }
      setIsKanbanModalOpen(true);
    } else {
      setSelectedEvent(event);
      setIsEventModalOpen(true);
    }
  };

  const handleOpenAddEventModal = () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
    } else {
      setSelectedEvent(null);
      setSelectedDate(new Date());
      setIsEventModalOpen(true);
    }
  };

  const handleOpenSettingsModal = () => {
    if (!currentUser) {
      setIsLoginPromptOpen(true);
    } else {
      setIsSettingsModalOpen(true);
    }
  };

  const handleSaveEvent = async (eventToSave: Event) => {
    try {
      const isNew = !eventToSave.id || !events.some((e) => e.id === eventToSave.id);
      const savedEvent = await api.apiSaveEvent(eventToSave, isNew);
      setEvents((currentEvents) => {
        if (isNew) {
          return [...currentEvents, savedEvent];
        }
        return currentEvents.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      });
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("일정 저장에 실패했습니다.");
    }
  };

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      const eventToDelete = events.find((e) => e.id === eventId);
      if (!eventToDelete) return;

      const confirmationMessage = eventToDelete.subCategoryId
        ? "이 일정을 삭제하시겠습니까? 관련된 모든 칸반 태스크도 함께 삭제됩니다."
        : "이 일정을 삭제하시겠습니까?";

      if (window.confirm(confirmationMessage)) {
        try {
          await api.apiDeleteEvent(eventId);
          setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));

          setKanbanTasks((prevTasks) => {
            const newTasks = { ...prevTasks };
            delete newTasks[eventId];
            return newTasks;
          });

          setIsKanbanModalOpen(false);
          setIsEventModalOpen(false);
          setSelectedEvent(null);
        } catch (error) {
          console.error("Failed to delete event:", error);
          alert("일정 삭제에 실패했습니다.");
        }
      }
    },
    [events]
  );

  const handleUpdateKanbanTasks = useCallback(
    async (newTasks: Task[]) => {
      if (selectedEvent) {
        try {
          const updatedTasks = await api.apiUpdateTasksForEvent(selectedEvent.id, newTasks);
          setKanbanTasks((prev) => ({ ...prev, [selectedEvent.id]: updatedTasks }));
        } catch (error) {
          console.error("Failed to update kanban tasks:", error);
          alert("칸반 보드 업데이트에 실패했습니다.");
        }
      }
    },
    [selectedEvent]
  );

  const handleUpdateCategories = async (updatedCategories: Category[]) => {
    try {
      const savedCategories = await api.apiSaveCategories(updatedCategories);
      setCategories(savedCategories);
    } catch (error) {
      console.error("Failed to update categories:", error);
      alert("카테고리 업데이트에 실패했습니다.");
    }
  };

  const handleUpdateTaskTemplates = async (updatedTemplates: { [subCategoryId: string]: TaskTemplate[] }) => {
    try {
      const savedTemplates = await api.apiSaveTaskTemplates(updatedTemplates);
      setTaskTemplates(savedTemplates);
    } catch (error: any) {
      console.error("Failed to update task templates:", error);
      
      // 중복 content 에러 처리
      if (error.message && error.message.includes('DUPLICATE_CONTENT')) {
        alert("중복된 내용의 태스크 템플릿이 있습니다. 동일한 내용을 제거하고 다시 시도해주세요.");
      } else {
        alert("태스크 템플릿 업데이트에 실패했습니다.");
      }
    }
  };

  const getCategory = useCallback(
    (categoryId: string) => {
      return categories.find((c) => c.id === categoryId);
    },
    [categories]
  );

  const tasksForKanban = useMemo(() => {
    if (selectedEvent?.id && kanbanTasks[selectedEvent.id]) {
      return kanbanTasks[selectedEvent.id];
    }
    return [];
  }, [selectedEvent, kanbanTasks]);

  const taskTemplatesForKanban = useMemo(() => {
    if (selectedEvent?.subCategoryId && taskTemplates[selectedEvent.subCategoryId]) {
      return taskTemplates[selectedEvent.subCategoryId];
    }
    return [];
  }, [selectedEvent, taskTemplates]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700">캘린더를 불러오는 중...</div>
      </div>
    );
  }

  const renderEventPill = (event: Event) => {
    const category = getCategory(event.categoryId);
    if (!category) return null;
    return (
      <div
        key={event.id}
        onClick={(e) => {
          e.stopPropagation();
          handleEventClick(event);
        }}
        className="w-full text-left p-1 mb-1 rounded-md text-xs text-white truncate cursor-pointer"
        style={{ backgroundColor: category.color }}
      >
        <span className="font-semibold">{event.startTime}</span> {event.title}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans">
      {authError && (
        <div className="bg-red-500 text-white text-center p-2">
          {authError}
          <button onClick={() => setAuthError(null)} className="ml-4 font-bold">
            X
          </button>
        </div>
      )}
      <header className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Smart Calendar</h1>
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Today
          </button>
          <div className="flex items-center">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft />
            </button>
            <h2 className="w-40 text-center text-lg font-semibold text-gray-700">
              {currentDate.getFullYear()}년 {currentDate.toLocaleString("ko-KR", { month: "long" })}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleOpenAddEventModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            일정 추가
          </button>
          <button
            onClick={handleOpenSettingsModal}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
          >
            <Settings className="w-5 h-5" />
          </button>
          {currentUser ? (
            <>
              <div className="flex items-center gap-2">
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />
                <span className="hidden lg:block text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoginPromptOpen(true)}
              className="flex items-center gap-3 px-4 py-2 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <GoogleIcon className="w-5 h-5" />
              Google 계정으로 로그인
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 grid grid-cols-7 overflow-y-auto">
        {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
          <div
            key={day}
            className={`text-center font-medium text-sm py-2 border-b ${
              day === "일" ? "text-red-500" : day === "토" ? "text-blue-500" : "text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
        {daysInMonth.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const dayEvents = currentUser
            ? events
                .filter((e) => e.date === day.toISOString().split("T")[0])
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
            : [];

          const dayOfWeek = index % 7;

          return (
            <div
              key={day.toString()}
              className={`relative border-r border-b p-1.5 flex flex-col cursor-pointer transition-colors duration-200 ${
                isCurrentMonth ? "bg-white" : "bg-gray-50"
              } ${currentUser ? "hover:bg-blue-50" : "hover:bg-gray-100"}`}
              onClick={() => handleDayClick(day)}
              style={{ minHeight: "120px" }}
            >
              <span
                className={`text-sm ${
                  isToday
                    ? "bg-blue-600 text-white rounded-full flex items-center justify-center h-6 w-6 font-bold"
                    : `h-6 w-6 flex items-center justify-center ${
                        dayOfWeek === 0
                          ? "text-red-500"
                          : dayOfWeek === 6
                          ? "text-blue-500"
                          : isCurrentMonth
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`
                }`}
              >
                {day.getDate()}
              </span>
              <div className="flex-1 mt-1 overflow-y-auto">{dayEvents.map(renderEventPill)}</div>
            </div>
          );
        })}
      </main>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        categories={categories}
        selectedDate={selectedDate}
      />
      <AdminSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        categories={categories}
        onUpdateCategories={handleUpdateCategories}
        taskTemplates={taskTemplates}
        onUpdateTaskTemplates={handleUpdateTaskTemplates}
      />
      <KanbanModal
        isOpen={isKanbanModalOpen}
        onClose={() => setIsKanbanModalOpen(false)}
        event={selectedEvent}
        tasks={tasksForKanban}
        onUpdateTasks={handleUpdateKanbanTasks}
        onDeleteEvent={handleDeleteEvent}
        taskTemplates={taskTemplatesForKanban}
        currentUser={currentUser}
      />
      <LoginPromptModal isOpen={isLoginPromptOpen} onClose={() => setIsLoginPromptOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default CalendarPage;