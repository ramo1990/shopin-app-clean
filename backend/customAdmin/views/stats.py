from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count
from orders.models import Order
from shop.models import Product
from datetime import datetime, timedelta
from rest_framework.permissions import BasePermission


# Seuls les utilisateurs staff peuvent accéder aux commandes (IsAdminStaff).
class IsAdminStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)
    
class AdminStatsView(APIView):
    permission_classes = [IsAdminStaff]

    def get(self, request):
        now = datetime.now()
        months = [(now - timedelta(days=30 * i)).strftime('%b') for i in reversed(range(6))]
        sales_data = []
        for i in reversed(range(6)):
            month_start = (now - timedelta(days=30 * i)).replace(day=1)
            month_end = (month_start + timedelta(days=30))
            sales = Order.objects.filter(created_at__gte=month_start, created_at__lt=month_end).aggregate(s=Sum('total'))['s'] or 0
            sales_data.append(sales)

        recent_products = list(Product.objects.all().order_by('-created_at')[:5].values('id', 'title', 'price'))

        return Response({
            'totalSales': Order.objects.aggregate(s=Sum('total'))['s'] or 0,
            'totalOrders': Order.objects.aggregate(c=Count('id'))['c'],
            'chart': {'months': months, 'sales': sales_data},
            'recentProducts': recent_products,
        })
