import { AppProvider } from '../contexts/AppContext';
import { ToastProvider } from '../contexts/ToastContext';
import { DarkModeProvider } from '../contexts/DarkModeContext';
import { FormErrorProvider } from '../contexts/FormErrorContext';

// Import the new admin contexts you created
import { UserAdminProvider } from '../contexts/UserAdminContext';
import { ContentAdminProvider } from '../contexts/ContentAdminContext';
import { SystemAdminProvider } from '../contexts/SystemAdminContext';
// import { BillingAdminProvider } from '../contexts/BillingAdminContext';

export const AppProviders = ({ children }) => {
  return (
    <DarkModeProvider>
      <ToastProvider>
        <AppProvider>
          <FormErrorProvider>
            <UserAdminProvider>
              <ContentAdminProvider>
                <SystemAdminProvider>{children}</SystemAdminProvider>
              </ContentAdminProvider>
            </UserAdminProvider>
          </FormErrorProvider>
        </AppProvider>
      </ToastProvider>
    </DarkModeProvider>
  );
};
