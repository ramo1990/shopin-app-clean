# from django.contrib.auth.forms import PasswordResetForm
# from django.template.loader import render_to_string
# from django.core.mail import send_mail

# class CustomPasswordResetForm(PasswordResetForm):

#     def send_mail(self, subject_template_name, email_template_name,
#                   context, from_email, to_email, html_email_template_name=None):
#         # Construire le lien vers frontend
#         uid = context['uid']
#         token = context['token']
#         frontend_url = f"http://localhost:3000/reset-password-confirm?uid={uid}&token={token}"
        
#         context['frontend_url'] = frontend_url
        
#         subject = render_to_string(subject_template_name, context)
#         subject = ''.join(subject.splitlines())
#         body = render_to_string(email_template_name, context)
        
#         send_mail(subject, body, from_email, [to_email], html_message=html_email_template_name)
