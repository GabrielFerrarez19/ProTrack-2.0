import { useSidebar } from "./SidebarContext";
import { Link } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";

type SidebarItemProps = {
  active?: boolean;
  icon: React.ReactNode;
  text: string;
  alert?: boolean;
  router?: string; // rota para navegação
  requiredRoles?: string[]; // roles necessárias para exibir o item
};

export function SidebarItem({
  active = false,
  icon,
  text,
  alert = false,
  router,
  requiredRoles = [],
}: SidebarItemProps) {
  const { expanded } = useSidebar();
  const { hasRole } = usePermissions();

  // Se o item tem roles específicas e o usuário não tem permissão, não renderiza
  if (requiredRoles.length > 0 && !hasRole(requiredRoles as any)) {
    return null;
  }

  const content = (
    <>
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-auto rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}
      {!expanded && (
        <div
          className="
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          "
        >
          {text}
        </div>
      )}
    </>
  );

  if (router) {
    return (
      <li
        className={`
          relative flex items-center w-auto h-10 py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
              : "hover:bg-indigo-50 text-gray-600"
          }
        `}
      >
        <Link to={router} className="flex items-center w-full">
          {content}
        </Link>
      </li>
    );
  }

  return (
    <li
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }
      `}
    >
      {content}
    </li>
  );
}
