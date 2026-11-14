import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CircleUserRound,
  CreditCard,
  Home,
  Inbox,
  LayoutDashboard,
  Library,
  ListChecks,
  Users,
} from "lucide-react";
import { SignOut } from "@/features/account";
import { WorkspaceNavigation } from "./workspace-navigation";

export const teacherViews = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "lessons", label: "Lessons", icon: CalendarDays },
  { id: "students", label: "Students", icon: Users },
  { id: "allocations", label: "Package credits", icon: CreditCard },
  { id: "inquiries", label: "Inquiries", icon: Inbox },
  { id: "content", label: "Website content", icon: Library },
  { id: "leads", label: "Guide requests", icon: CircleUserRound },
  { id: "activity", label: "Activity", icon: ListChecks },
];
export const studentViews = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "lessons", label: "My lessons", icon: CalendarDays },
  { id: "credits", label: "My credits", icon: CreditCard },
  { id: "practice", label: "Practice", icon: BookOpen },
  { id: "profile", label: "My profile", icon: CircleUserRound },
  { id: "requests", label: "My requests", icon: Inbox },
];
export function WorkspaceShell({
  role,
  active,
  name,
  children,
}: {
  role: "teacher" | "student";
  active: string;
  name: string;
  children: React.ReactNode;
}) {
  const teacher = role === "teacher";
  const menu = teacher ? teacherViews : studentViews;
  const base = teacher ? "/admin" : "/dashboard";
  return (
    <div className="learning-workspace">
      <aside className="workspace-sidebar">
        <Link href="/" className="wordmark" aria-label="TeachVero home">
          teach<span>vero</span>
          <i>✳</i>
        </Link>
        <p className="workspace-role">
          {teacher ? "Teacher workspace" : "Your learning space"}
        </p>
        <WorkspaceNavigation
          active={active}
          label={
            teacher
              ? "Teacher workspace sections"
              : "Student workspace sections"
          }
        >
          {menu.map(({ id, label, icon: Icon }) => (
            <Link
              key={id}
              href={base + (id === "overview" ? "" : "?view=" + id)}
              aria-current={active === id ? "page" : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </WorkspaceNavigation>
        <div className="workspace-sidebar-bottom">
          <p>
            Italian, personally.
            <br />
            <span>With Veronica.</span>
          </p>
          <Link href="/">
            <Home size={17} />
            Visit the website <ArrowUpRight size={15} />
          </Link>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <span>
            {teacher
              ? "Teach. Plan. Connect."
              : "A little Italian, every time."}
          </span>
          <div>
            <span className="account-name">
              <span className="avatar-mini" aria-hidden="true">
                {name.charAt(0)}
              </span>
              {name.split(" ")[0]}
            </span>
            <SignOut />
          </div>
        </header>
        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <p>{teacher ? "Your teaching desk" : "Learning with Veronica"}</p>
              <h1>
                {active === "overview"
                  ? teacher
                    ? "Let’s plan your teaching."
                    : `Ciao, ${name.split(" ")[0]}.`
                  : menu.find((item) => item.id === active)?.label}
              </h1>
            </div>
            <Link
              className="button button-primary"
              href={teacher ? "/admin?view=lessons" : "/book"}
            >
              {teacher ? "Plan a lesson" : "Request a lesson"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          {children}
        </div>
        <footer className="workspace-footer">
          TeachVero · Local demo workspace{" "}
          <Link href="/legal/privacy">Privacy</Link>
        </footer>
      </div>
    </div>
  );
}
