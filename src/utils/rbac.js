const ROLES = {
    TECHNICIAN: 'technician',
    SUPERVISOR: 'supervisor',
    DISPATCHER: 'dispatcher',
    ADMIN: 'admin',
    EXECUTIVE: 'executive',
    VENDOR: 'vendor',
};

// Hierarchical permissions: higher roles inherit permissions from lower ones.
const HIERARCHY = {
    [ROLES.EXECUTIVE]: [ROLES.ADMIN],
    [ROLES.ADMIN]: [ROLES.SUPERVISOR, ROLES.DISPATCHER],
    [ROLES.SUPERVISOR]: [ROLES.TECHNICIAN],
    [ROLES.DISPATCHER]: [],
    [ROLES.TECHNICIAN]: [],
    [ROLES.VENDOR]: [],
};

const PERMISSIONS = {
    // page access
    'page:view:dashboard': [ROLES.TECHNICIAN, ROLES.SUPERVISOR, ROLES.DISPATCHER, ROLES.ADMIN, ROLES.EXECUTIVE, ROLES.VENDOR],
    'page:view:submissions': [ROLES.TECHNICIAN, ROLES.VENDOR],
    'page:view:forms': [ROLES.TECHNICIAN, ROLES.VENDOR], // generic forms
    'page:view:approvals': [ROLES.SUPERVISOR],
    'page:view:projects': [ROLES.SUPERVISOR],
    'page:view:schedule': [ROLES.SUPERVISOR, ROLES.DISPATCHER],
    'page:view:dispatch': [ROLES.DISPATCHER],
    'page:view:crew_rotation': [ROLES.SUPERVISOR],
    'page:view:reports': [ROLES.SUPERVISOR, ROLES.ADMIN, ROLES.EXECUTIVE],
    'page:view:field_tickets': [ROLES.SUPERVISOR],
    'page:view:map': [ROLES.ADMIN],
    'page:view:invoicing': [ROLES.ADMIN],
    'page:view:users': [ROLES.ADMIN],
    'page:view:assets': [ROLES.ADMIN],
    'page:view:inventory': [ROLES.ADMIN],
    'page:view:pm_plans': [ROLES.ADMIN],
    'page:view:vendors': [ROLES.ADMIN],
    'page:view:job_detail': [ROLES.TECHNICIAN, ROLES.SUPERVISOR, ROLES.DISPATCHER, ROLES.ADMIN, ROLES.EXECUTIVE, ROLES.VENDOR],
    'page:view:asset_detail': [ROLES.TECHNICIAN, ROLES.SUPERVISOR, ROLES.ADMIN, ROLES.EXECUTIVE],
    'page:view:find_part': [ROLES.TECHNICIAN, ROLES.SUPERVISOR],

    // actions
    'job:create': [ROLES.SUPERVISOR, ROLES.ADMIN, ROLES.EXECUTIVE],
    'job:assign': [ROLES.SUPERVISOR, ROLES.DISPATCHER],
    'job:complete': [ROLES.SUPERVISOR],
    'map:manage': [ROLES.ADMIN], // Edit geofences, add jobs from map
    'submission:approve': [ROLES.SUPERVISOR],
    'submission:edit_approved': [ROLES.SUPERVISOR], // Can edit before final approval
    'invoice:create': [ROLES.ADMIN],
    'user:manage': [ROLES.ADMIN],
    'asset:manage': [ROLES.ADMIN],
    'inventory:manage': [ROLES.ADMIN],
    'inventory:transfer': [ROLES.ADMIN, ROLES.SUPERVISOR], // Supervisors can authorize truck-to-truck
    'part:find': [ROLES.TECHNICIAN, ROLES.SUPERVISOR], // Techs and supervisors can find parts
    'report:build': [ROLES.SUPERVISOR, ROLES.ADMIN, ROLES.EXECUTIVE],
    'pm_plan:run': [ROLES.ADMIN],
};

const checkPermission = (userRole, requiredRoles) => {
    if (requiredRoles.includes(userRole)) {
        return true;
    }
    // Check inherited roles
    let rolesToCheck = HIERARCHY[userRole] || [];
    let checkedRoles = new Set([userRole]);

    while (rolesToCheck.length > 0) {
        const currentRole = rolesToCheck.pop();
        if (checkedRoles.has(currentRole)) continue;

        if (requiredRoles.includes(currentRole)) {
            return true;
        }
        checkedRoles.add(currentRole);
        rolesToCheck.push(...(HIERARCHY[currentRole] || []));
    }

    return false;
};

export const can = (user, permission) => {
    if (!user || !user.role) {
        return false;
    }
    const requiredRoles = PERMISSIONS[permission];
    if (!requiredRoles) {
        // Default to deny if permission doesn't exist
        console.warn(`Permission '${permission}' not found in RBAC config.`);
        return false;
    }
    return checkPermission(user.role, requiredRoles);
};