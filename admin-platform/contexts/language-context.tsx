"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type Language = "en" | "ru" | "uz"

type TranslationRecord = Record<string, string>
type TranslationsType = Record<Language, TranslationRecord>

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  translations: TranslationsType
}

export const translations: TranslationsType = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.create": "Create Test",
    "nav.saved": "Saved Tests",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.profile": "Profile",
    "nav.logout": "Log out",
    "nav.customers": "Customers",
    "nav.invoices": "Invoices",
    "nav.reports": "Reports",

    // Common
    "common.search": "Search",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.back": "Back",
    "common.next": "Next",
    "common.submit": "Submit",
    "common.loading": "Loading...",
    "common.upgrade": "Upgrade Plan",
    "common.save_changes": "Save Changes",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Overview of your test activities and performance",
    "dashboard.welcome": "Welcome back! Here's an overview of your test activities.",
    "dashboard.create": "Create New Test",
    "dashboard.total_tests": "Total Tests",
    "dashboard.active_users": "Active Users",
    "dashboard.completion_rate": "Completion Rate",
    "dashboard.overview": "Overview",
    "dashboard.analytics": "Analytics",
    "dashboard.reports": "Reports",
    "dashboard.activity": "Test Generation Activity",
    "dashboard.recent": "Recent Activity",

    // Auth
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.forgot": "Forgot password?",
    "auth.no_account": "Don't have an account?",
    "auth.has_account": "Already have an account?",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account settings and preferences.",
    "settings.general": "General",
    "settings.security": "Security",
    "settings.notifications": "Notifications",
    "settings.billing": "Billing",
    "settings.appearance": "Appearance",
    "settings.advanced": "Advanced",
    "settings.password": "Password",
    "settings.password.change": "Change your password or enable two-factor authentication.",
    "settings.appearance.title": "Appearance Settings",
    "settings.appearance.subtitle": "Customize the look and feel of your dashboard.",
    "settings.appearance.theme": "Theme Color",
    "settings.appearance.dark_mode": "Dark Mode",
    "settings.appearance.dark_mode.desc": "Toggle between light and dark mode.",
    "settings.appearance.font_size": "Font Size",
    "settings.appearance.reset": "Reset to Defaults",

    // Language
    "language.english": "English",
    "language.russian": "Russian",
    "language.uzbek": "Uzbek",
    "language.select": "Select Language",

    // Profile
    "profile.title": "Profile",
    "profile.subtitle": "Manage your personal information and public profile.",

    // Saved Tests
    "saved.title": "Saved Tests",
    "saved.subtitle": "Manage and organize your created tests.",

    // Create Test
    "create.title": "Create New Test",
    "create.subtitle": "Set your test parameters and let our AI generate questions for you.",

    // Color Themes
    "theme.purple": "Purple",
    "theme.blue": "Blue",
    "theme.green": "Green",
    "theme.red": "Red",
    "theme.orange": "Orange",
    "theme.default": "Default",

    // Add translations for monitor page
    "monitor.title": "Test Monitoring",
    "monitor.subtitle": "Monitor participants and manage your test in real-time.",
    "monitor.start": "Start Test",
    "monitor.starting": "Starting Test...",
    "monitor.pause": "Pause Test",
    "monitor.resume": "Resume Test",
    "monitor.preview": "Preview Test",
    "monitor.attention": "Attention Required",
    "monitor.time_remaining": "Time Remaining",
    "monitor.participants": "Participants",
    "monitor.average_progress": "Average Progress",
    "monitor.access_info": "Test Access Information",
    "monitor.share_info": "Share this information with participants to allow them to join the test",
    "monitor.access_code": "Access Code",
    "monitor.qr_code": "QR Code",
    "monitor.direct_link": "Direct Link",
    "monitor.participants_tab": "Participants",
    "monitor.results_tab": "Results & Analytics",
    "monitor.participants_list": "Participants List",
    "monitor.participant_actions": "Actions",
    "monitor.view_details": "View Details",
    "monitor.send_message": "Send Message",
    "monitor.remove_participant": "Remove Participant",
    "monitor.confirm_remove": "Are you sure you want to remove participant?",
    "monitor.detailed_results": "Detailed Results",
    "monitor.avg_score": "Average Score",
    "monitor.completion_rate": "Completion Rate",
    "monitor.avg_time": "Avg. Time Spent",
    "monitor.export_results": "Download Results",
    "monitor.generate_report": "Generate Report",

    // Add translations for pricing modal
    "pricing.title": "Choose Your Plan",
    "pricing.subtitle": "Select a plan that best fits your testing needs.",
    "pricing.select_plan": "Select Plan",
    "pricing.basic": "Basic",
    "pricing.standard": "Standard",
    "pricing.premium": "Premium",
    "pricing.popular": "Popular",
    "pricing.basic_desc": "Essential features for small tests",
    "pricing.standard_desc": "Advanced features for professional use",
    "pricing.premium_desc": "Enterprise-grade testing solution",
    "pricing.per_month": "per month",
    "pricing.plan_selected": "Plan Selected",
    "pricing.test_ready": "Your test is ready to be shared with participants",
    "pricing.unique_code": "Unique Access Code",
    "pricing.share_code": "Share this code with your participants",
    "pricing.qr_code": "QR Code",
    "pricing.scan_qr": "Scan this QR code to access the test",
    "pricing.invite_link": "Invite Link",
    "pricing.share_link": "Share this link with your participants",
    "pricing.back_to_plans": "Back to Plans",
    "pricing.go_to_monitoring": "Go to Test Monitoring",

    // Analytics
    "analytics.title": "Analytics Dashboard",
    "analytics.subtitle": "Comprehensive insights into your test performance and user engagement.",
    "analytics.overview": "Overview",
    "analytics.performance": "Performance",
    "analytics.subjects": "Subjects",
    "analytics.timeframe": "Timeframe",
    "analytics.filter": "Filter",
    "analytics.download": "Download Report",
    "analytics.tests_created": "Tests Created",
    "analytics.participants": "Participants",
    "analytics.completion_rate": "Completion Rate",
    "analytics.avg_score": "Average Score",
    "analytics.from_last_month": "from last month",
    "analytics.test_activity": "Test Activity",
    "analytics.test_activity_desc": "Number of tests created and participants over time",
    "analytics.performance_dist": "Performance Distribution",
    "analytics.performance_dist_desc": "Distribution of test scores across all participants",
    "analytics.subject_dist": "Subject Distribution",
    "analytics.subject_dist_desc": "Breakdown of tests by subject area",
    "analytics.recent_tests": "Recent Tests",
    "analytics.view_all": "View All",
    "analytics.test_name": "Test Name",
    "analytics.subject": "Subject",
    "analytics.participants_count": "Participants",
    "analytics.avg_score_label": "Avg. Score",
    "analytics.date": "Date",
  },
  ru: {
    // Navigation
    "nav.dashboard": "Панель управления",
    "nav.create": "Создать тест",
    "nav.saved": "Сохраненные тесты",
    "nav.analytics": "Аналитика",
    "nav.settings": "Настройки",
    "nav.profile": "Профиль",
    "nav.logout": "Выйти",
    "nav.customers": "Клиенты",
    "nav.invoices": "Счета",
    "nav.reports": "Отчеты",

    // Common
    "common.search": "Поиск",
    "common.save": "Сохранить",
    "common.cancel": "Отмена",
    "common.back": "Назад",
    "common.next": "Далее",
    "common.submit": "Отправить",
    "common.loading": "Загрузка...",
    "common.upgrade": "Улучшить план",
    "common.save_changes": "Сохранить изменения",

    // Dashboard
    "dashboard.title": "Панель управления",
    "dashboard.subtitle": "Обзор ваших тестовых активностей и производительности",
    "dashboard.welcome": "С возвращением! Вот обзор ваших тестовых активностей.",
    "dashboard.create": "Создать новый тест",
    "dashboard.total_tests": "Всего тестов",
    "dashboard.active_users": "Активные пользователи",
    "dashboard.completion_rate": "Процент завершения",
    "dashboard.overview": "Обзор",
    "dashboard.analytics": "Аналитика",
    "dashboard.reports": "Отчеты",
    "dashboard.activity": "Активность создания тестов",
    "dashboard.recent": "Недавняя активность",

    // Auth
    "auth.signin": "Вход",
    "auth.signup": "Регистрация",
    "auth.email": "Электронная почта",
    "auth.password": "Пароль",
    "auth.forgot": "Забыли пароль?",
    "auth.no_account": "Нет аккаунта?",
    "auth.has_account": "Уже есть аккаунт?",

    // Settings
    "settings.title": "Настройки",
    "settings.subtitle": "Управляйте настройками вашего аккаунта и предпочтениями.",
    "settings.general": "Общие",
    "settings.security": "Безопасность",
    "settings.notifications": "Уведомления",
    "settings.billing": "Оплата",
    "settings.appearance": "Внешний вид",
    "settings.advanced": "Расширенные",
    "settings.password": "Пароль",
    "settings.password.change": "Измените пароль или включите двухфакторную аутентификацию.",
    "settings.appearance.title": "Настройки внешнего вида",
    "settings.appearance.subtitle": "Настройте внешний вид вашей панели управления.",
    "settings.appearance.theme": "Цветовая тема",
    "settings.appearance.dark_mode": "Темный режим",
    "settings.appearance.dark_mode.desc": "Переключение между светлым и темным режимом.",
    "settings.appearance.font_size": "Размер шрифта",
    "settings.appearance.reset": "Сбросить настройки",

    // Language
    "language.english": "Английский",
    "language.russian": "Русский",
    "language.uzbek": "Узбекский",
    "language.select": "Выбрать язык",

    // Profile
    "profile.title": "Профиль",
    "profile.subtitle": "Управляйте вашей личной информацией и публичным профилем.",

    // Saved Tests
    "saved.title": "Сохраненные тесты",
    "saved.subtitle": "Управляйте и организуйте ваши созданные тесты.",

    // Create Test
    "create.title": "Создать новый тест",
    "create.subtitle": "Установите параметры теста и позвольте нашему ИИ сгенерировать вопросы.",

    // Color Themes
    "theme.purple": "Фиолетовый",
    "theme.blue": "Синий",
    "theme.green": "Зеленый",
    "theme.red": "Красный",
    "theme.orange": "Оранжевый",
    "theme.default": "По умолчанию",

    // First add the monitor page translations
    "monitor.title": "Мониторинг теста",
    "monitor.subtitle": "Следите за участниками и управляйте тестом в реальном времени.",
    "monitor.start": "Начать тест",
    "monitor.starting": "Запуск теста...",
    "monitor.pause": "Приостановить тест",
    "monitor.resume": "Продолжить тест",
    "monitor.preview": "Предпросмотр теста",
    "monitor.attention": "Требуется внимание",
    "monitor.time_remaining": "Оставшееся время",
    "monitor.participants": "Участники",
    "monitor.average_progress": "Средний прогресс",
    "monitor.access_info": "Информация о доступе к тесту",
    "monitor.share_info": "Поделитесь этой информацией с участниками, чтобы они могли присоединиться к тесту",
    "monitor.access_code": "Код доступа",
    "monitor.qr_code": "QR-код",
    "monitor.direct_link": "Прямая ссылка",
    "monitor.participants_tab": "Участники",
    "monitor.results_tab": "Результаты и аналитика",
    "monitor.participants_list": "Список участников",
    "monitor.participant_actions": "Действия",
    "monitor.view_details": "Просмотр деталей",
    "monitor.send_message": "Отправить сообщение",
    "monitor.remove_participant": "Удалить участника",
    "monitor.confirm_remove": "Вы уверены, что хотите удалить участника?",
    "monitor.detailed_results": "Подробные результаты",
    "monitor.avg_score": "Средний балл",
    "monitor.completion_rate": "Процент завершения",
    "monitor.avg_time": "Среднее затраченное время",
    "monitor.export_results": "Скачать результаты",
    "monitor.generate_report": "Создать отчет",

    // Now add pricing modal translations in Russian
    "pricing.title": "Выберите свой план",
    "pricing.subtitle": "Выберите план, который лучше всего соответствует вашим потребностям тестирования.",
    "pricing.select_plan": "Выбрать план",
    "pricing.basic": "Базовый",
    "pricing.standard": "Стандартный",
    "pricing.premium": "Премиум",
    "pricing.popular": "Популярный",
    "pricing.basic_desc": "Основные функции для небольших тестов",
    "pricing.standard_desc": "Расширенные функции для профессионального использования",
    "pricing.premium_desc": "Корпоративное решение для тестирования",
    "pricing.per_month": "в месяц",
    "pricing.plan_selected": "План выбран",
    "pricing.test_ready": "Ваш тест готов к тому, чтобы поделиться с участниками",
    "pricing.unique_code": "Уникальный код доступа",
    "pricing.share_code": "Поделитесь этим кодом с участниками",
    "pricing.qr_code": "QR-код",
    "pricing.scan_qr": "Отсканируйте этот QR-код для доступа к тесту",
    "pricing.invite_link": "Ссылка для приглашения",
    "pricing.share_link": "Поделитесь этой ссылкой с участниками",
    "pricing.back_to_plans": "Вернуться к планам",
    "pricing.go_to_monitoring": "Перейти к мониторингу теста",

    // Analytics
    "analytics.title": "Панель аналитики",
    "analytics.subtitle": "Комплексный анализ эффективности тестов и вовлеченности пользователей.",
    "analytics.overview": "Обзор",
    "analytics.performance": "Производительность",
    "analytics.subjects": "Предметы",
    "analytics.timeframe": "Временной период",
    "analytics.filter": "Фильтр",
    "analytics.download": "Скачать отчет",
    "analytics.tests_created": "Созданные тесты",
    "analytics.participants": "Участники",
    "analytics.completion_rate": "Процент завершения",
    "analytics.avg_score": "Средний балл",
    "analytics.from_last_month": "с прошлого месяца",
    "analytics.test_activity": "Активность тестирования",
    "analytics.test_activity_desc": "Количество созданных тестов и участников с течением времени",
    "analytics.performance_dist": "Распределение производительности",
    "analytics.performance_dist_desc": "Распределение результатов тестов среди всех участников",
    "analytics.subject_dist": "Распределение по предметам",
    "analytics.subject_dist_desc": "Разбивка тестов по предметным областям",
    "analytics.recent_tests": "Недавние тесты",
    "analytics.view_all": "Посмотреть все",
    "analytics.test_name": "Название теста",
    "analytics.subject": "Предмет",
    "analytics.participants_count": "Участники",
    "analytics.avg_score_label": "Ср. балл",
    "analytics.date": "Дата",
  },
  uz: {
    // Navigation
    "nav.dashboard": "Boshqaruv paneli",
    "nav.create": "Test yaratish",
    "nav.saved": "Saqlangan testlar",
    "nav.analytics": "Tahlillar",
    "nav.settings": "Sozlamalar",
    "nav.profile": "Profil",
    "nav.logout": "Chiqish",
    "nav.customers": "Mijozlar",
    "nav.invoices": "Hisob-fakturalar",
    "nav.reports": "Hisobotlar",

    // Common
    "common.search": "Qidirish",
    "common.save": "Saqlash",
    "common.cancel": "Bekor qilish",
    "common.back": "Orqaga",
    "common.next": "Keyingi",
    "common.submit": "Yuborish",
    "common.loading": "Yuklanmoqda...",
    "common.upgrade": "Tarifni yangilash",
    "common.save_changes": "O'zgarishlarni saqlash",

    // Dashboard
    "dashboard.title": "Boshqaruv paneli",
    "dashboard.subtitle": "Test faoliyatingiz va samaradorligingiz haqida umumiy ma'lumot",
    "dashboard.welcome": "Qaytib kelganingiz bilan! Bu yerda test faoliyatingiz haqida umumiy ma'lumot.",
    "dashboard.create": "Yangi test yaratish",
    "dashboard.total_tests": "Jami testlar",
    "dashboard.active_users": "Faol foydalanuvchilar",
    "dashboard.completion_rate": "Tugatish darajasi",
    "dashboard.overview": "Umumiy ko'rinish",
    "dashboard.analytics": "Tahlillar",
    "dashboard.reports": "Hisobotlar",
    "dashboard.activity": "Test yaratish faoliyati",
    "dashboard.recent": "So'nggi faoliyat",

    // Auth
    "auth.signin": "Kirish",
    "auth.signup": "Ro'yxatdan o'tish",
    "auth.email": "Elektron pochta",
    "auth.password": "Parol",
    "auth.forgot": "Parolni unutdingizmi?",
    "auth.no_account": "Hisobingiz yo'qmi?",
    "auth.has_account": "Hisobingiz bormi?",

    // Settings
    "settings.title": "Sozlamalar",
    "settings.subtitle": "Hisobingiz sozlamalari va afzalliklarini boshqaring.",
    "settings.general": "Umumiy",
    "settings.security": "Xavfsizlik",
    "settings.notifications": "Bildirishnomalar",
    "settings.billing": "To'lov",
    "settings.appearance": "Ko'rinish",
    "settings.advanced": "Kengaytirilgan",
    "settings.password": "Parol",
    "settings.password.change": "Parolingizni o'zgartiring yoki ikki faktorli autentifikatsiyani yoqing.",
    "settings.appearance.title": "Ko'rinish sozlamalari",
    "settings.appearance.subtitle": "Boshqaruv panelingizning ko'rinishini sozlang.",
    "settings.appearance.theme": "Rang mavzusi",
    "settings.appearance.dark_mode": "Qorong'i rejim",
    "settings.appearance.dark_mode.desc": "Yorug' va qorong'i rejim o'rtasida almashtirish.",
    "settings.appearance.font_size": "Shrift o'lchami",
    "settings.appearance.reset": "Standart sozlamalarga qaytarish",

    // Language
    "language.english": "Ingliz",
    "language.russian": "Rus",
    "language.uzbek": "O'zbek",
    "language.select": "Tilni tanlang",

    // Profile
    "profile.title": "Profil",
    "profile.subtitle": "Shaxsiy ma'lumotlaringiz va ommaviy profilingizni boshqaring.",

    // Saved Tests
    "saved.title": "Saqlangan testlar",
    "saved.subtitle": "Yaratilgan testlaringizni boshqaring va tartibga soling.",

    // Create Test
    "create.title": "Yangi test yaratish",
    "create.subtitle": "Test parametrlarini o'rnating va bizning AI savollarni yaratishiga ruxsat bering.",

    // Color Themes
    "theme.purple": "Binafsha",
    "theme.blue": "Ko'k",
    "theme.green": "Yashil",
    "theme.red": "Qizil",
    "theme.orange": "To'q sariq",
    "theme.default": "Standart",

    // First add monitor page translations
    "monitor.title": "Test monitoringi",
    "monitor.subtitle": "Ishtirokchilarni kuzating va testni real vaqtda boshqaring.",
    "monitor.start": "Testni boshlash",
    "monitor.starting": "Test boshlanmoqda...",
    "monitor.pause": "Testni to'xtatish",
    "monitor.resume": "Testni davom ettirish",
    "monitor.preview": "Testni ko'rib chiqish",
    "monitor.attention": "E'tibor talab qilinadi",
    "monitor.time_remaining": "Qolgan vaqt",
    "monitor.participants": "Ishtirokchilar",
    "monitor.average_progress": "O'rtacha progress",
    "monitor.access_info": "Test kirish ma'lumotlari",
    "monitor.share_info": "Ishtirokchilar bilan bu ma'lumotni ulashing",
    "monitor.access_code": "Kirish kodi",
    "monitor.qr_code": "QR kod",
    "monitor.direct_link": "To'g'ridan-to'g'ri havola",
    "monitor.participants_tab": "Ishtirokchilar",
    "monitor.results_tab": "Natijalar va tahlillar",
    "monitor.participants_list": "Ishtirokchilar ro'yxati",
    "monitor.participant_actions": "Harakatlar",
    "monitor.view_details": "Tafsilotlarni ko'rish",
    "monitor.send_message": "Xabar yuborish",
    "monitor.remove_participant": "Ishtirokchini olib tashlash",
    "monitor.confirm_remove": "Ishtirokchini olib tashlashni istaysizmi?",
    "monitor.detailed_results": "Batafsil natijalar",
    "monitor.avg_score": "O'rtacha ball",
    "monitor.completion_rate": "Tugatish darajasi",
    "monitor.avg_time": "O'rtacha sarflangan vaqt",
    "monitor.export_results": "Natijalarni yuklab olish",
    "monitor.generate_report": "Hisobot yaratish",

    // Now add pricing modal translations in Uzbek
    "pricing.title": "Rejangizni tanlang",
    "pricing.subtitle": "Test ehtiyojlaringizga eng mos keluvchi rejani tanlang.",
    "pricing.select_plan": "Rejani tanlash",
    "pricing.basic": "Boshlang'ich",
    "pricing.standard": "Standart",
    "pricing.premium": "Premium",
    "pricing.popular": "Mashhur",
    "pricing.basic_desc": "Kichik testlar uchun asosiy imkoniyatlar",
    "pricing.standard_desc": "Professional foydalanish uchun kengaytirilgan imkoniyatlar",
    "pricing.premium_desc": "Korporativ darajadagi test yechimi",
    "pricing.per_month": "oyiga",
    "pricing.plan_selected": "Reja tanlandi",
    "pricing.test_ready": "Testingiz ishtirokchilar bilan ulashishga tayyor",
    "pricing.unique_code": "Noyob kirish kodi",
    "pricing.share_code": "Bu kodni ishtirokchilar bilan ulashing",
    "pricing.qr_code": "QR kod",
    "pricing.scan_qr": "Testga kirish uchun ushbu QR kodni skanerlang",
    "pricing.invite_link": "Taklif havolasi",
    "pricing.share_link": "Bu havolani ishtirokchilar bilan ulashing",
    "pricing.back_to_plans": "Rejalarga qaytish",
    "pricing.go_to_monitoring": "Test monitoringiga o'tish",

    // Analytics
    "analytics.title": "Tahlillar paneli",
    "analytics.subtitle": "Test samaradorligi va foydalanuvchilar faolligi bo'yicha keng qamrovli ma'lumotlar.",
    "analytics.overview": "Umumiy ko'rinish",
    "analytics.performance": "Samaradorlik",
    "analytics.subjects": "Fanlar",
    "analytics.timeframe": "Vaqt oralig'i",
    "analytics.filter": "Filtr",
    "analytics.download": "Hisobotni yuklab olish",
    "analytics.tests_created": "Yaratilgan testlar",
    "analytics.participants": "Ishtirokchilar",
    "analytics.completion_rate": "Tugatish darajasi",
    "analytics.avg_score": "O'rtacha ball",
    "analytics.from_last_month": "o'tgan oydan",
    "analytics.test_activity": "Test faoliyati",
    "analytics.test_activity_desc": "Vaqt davomida yaratilgan testlar va ishtirokchilar soni",
    "analytics.performance_dist": "Samaradorlik taqsimoti",
    "analytics.performance_dist_desc": "Barcha ishtirokchilar orasida test natijalarining taqsimlanishi",
    "analytics.subject_dist": "Fanlar bo'yicha taqsimot",
    "analytics.subject_dist_desc": "Testlarning fan sohalari bo'yicha taqsimlanishi",
    "analytics.recent_tests": "So'nggi testlar",
    "analytics.view_all": "Barchasini ko'rish",
    "analytics.test_name": "Test nomi",
    "analytics.subject": "Fan",
    "analytics.participants_count": "Ishtirokchilar",
    "analytics.avg_score_label": "O'rt. ball",
    "analytics.date": "Sana",
  },
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
  translations,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ru", "uz"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    if (typeof window !== "undefined") {
      localStorage.setItem("language", newLanguage)
    }
  }

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations.en
    return currentTranslations[key] || key
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations }}>{children}</LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

