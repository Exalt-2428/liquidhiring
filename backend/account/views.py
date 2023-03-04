from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from .validators import validate_file_extension
from .serializers import SignUpSerializer, UserSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
##############################################################
# from django.core.mail import send_mail
# from django.contrib.auth.tokens import default_token_generator
# from django.template.loader import render_to_string
# from django.utils.encoding import force_bytes, force_str
# from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# from django.contrib.sites.shortcuts import get_current_site
# from django.core.mail import EmailMessage


# Create your views here.

@api_view(['POST'])
def register(request):
    data = request.data

    user = SignUpSerializer(data=data)

    if user.is_valid():
        if not User.objects.filter(username=data['email']).exists():
           user = User.objects.create(
               first_name = data['first_name'],
               last_name = data['last_name'],
               username = data['email'],
               email = data['email'],
               password = make_password(data['password'])
           )

           return Response({
                'message': 'User registered.'},
                status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': 'User already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )

    else:
        return Response(user.errors)


# from django.contrib.auth import get_user_model
# from django.contrib.auth.tokens import PasswordResetTokenGenerator
# from django.core.mail import EmailMessage
# from django.utils.encoding import force_bytes
# from django.utils.http import urlsafe_base64_encode
# from rest_framework import status
# from rest_framework.decorators import api_view
# from rest_framework.response import Response

# class AccountActivationTokenGenerator(PasswordResetTokenGenerator):
#     def _make_hash_value(self, user, timestamp):
#         return (
#             str(user.pk) + str(timestamp) +
#             str(user.is_active)
#         )

# account_activation_token = AccountActivationTokenGenerator()

# @api_view(['POST'])
# def register(request):
#     data = request.data

#     user = SignUpSerializer(data=data)

#     if user.is_valid():
#         if not User.objects.filter(username=data['email']).exists():
#            user = User.objects.create(
#                first_name = data['first_name'],
#                last_name = data['last_name'],
#                username = data['email'],
#                email = data['email'],
#                password = make_password(data['password'])
#            )

#            uid = urlsafe_base64_encode(force_bytes(user.pk))
#            token = account_activation_token.make_token(user)

#            activate_url = f'http://localhost:3000/activate_email/{uid}/{token}'

#            email_body = f'Hi {user.first_name}, please use the following link to activate your account: {activate_url}'

#            email = EmailMessage(
#                'Activate your account',
#                email_body,
#                'noreply@liquidhiring.com',
#                [user.email],
#            )

#            email.send()

#            return Response({
#                 'message': 'User registered.'},
#                 status=status.HTTP_200_OK
#             )
#         else:
#             return Response({
#                 'error': 'User already exists'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#     else:
#         return Response(user.errors)


# def activate_email(request, uidb64, token):
#     from django.utils.http import urlsafe_base64_decode
#     from django.urls import reverse
#     from django.shortcuts import redirect
#     from django.contrib.auth import login

#     try:
#         uid = urlsafe_base64_encode(force_bytes(user.pk))
#         user = User.objects.get(pk=uid)
#     except (TypeError, ValueError, OverflowError, User.DoesNotExist):
#         user = None

#     if user is not None and account_activation_token.check_token(user, token):
#         user.is_active = True
#         user.save()
#         login(request, user)
#         return redirect(f'http://localhost:3000/me')
#     else:
#         return Response({
#             'error': 'Activation link is invalid.'},
#             status=status.HTTP_400_BAD_REQUEST
#         )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def currentUser(request):

    user = UserSerializer(request.user)

    return Response(user.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user

    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def uploadResume(request):

    user = request.user
    resume = request.FILES['resume']

    if resume == '':
        return Response({'error': 'Please upload your resume.'}, status=status.HTTP_400_BAD_REQUEST)

    isValidFile = validate_file_extension(resume.name)

    if not isValidFile:
        return Response({'error': 'Please upload only pdf file.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = UserSerializer(user, many=False)

    user.userprofile.resume = resume
    user.userprofile.save()

    return Response(serializer.data)
