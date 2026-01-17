@extends('layouts.app')

@section('title', 'Manage Products')

@section('content')
<style>
    /* full UI styles (from your requested design) */
    :root {
        --primary: #007bff;
        --secondary: #00b4d8;
        --card-bg: rgba(255, 255, 255, 0.95);
        --text-dark: #1b1f3b;
        --shadow: rgba(0, 0, 0, 0.1);
        --gradient-bg: linear-gradient(135deg, #e3f2fd, #f9fbff);
    }
    .main-content { margin: 30px auto; padding: 30px; background: var(--gradient-bg); min-height: 70vh; max-width: 1200px; }
    .products-container { background: var(--card-bg); border-radius: 16px; box-shadow: 0 8px 24px var(--shadow); backdrop-filter: blur(10px); padding: 24px; }
    .page-header { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:18px; }
    .page-header h2 { font-weight:700; color:var(--text-dark); font-size:22px; display:flex; gap:10px; align-items:center; }
    .page-header h2::before { content:"💊"; font-size:26px; }
    .filters { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
    .filters select, .filters input { padding:8px 12px; border-radius:8px; border:1px solid #ccc; font-size:14px; background:#fff; }
    .add-btn, .export-btn { background:var(--primary); color:#fff; padding:8px 14px; border-radius:8px; text-decoration:none; display:inline-flex; gap:8px; align-items:center; }
    .add-btn:hover, .export-btn:hover { background:var(--secondary); transform:translateY(-1px); }
    .export-btns { display:flex; gap:8px; }
    .products-table { overflow-x:auto; margin-top:12px; }
    table { width:100%; border-collapse:collapse; font-size:15px; }
    thead { background:var(--primary); color:#fff; }
    th, td { padding:12px 14px; border-bottom:1px solid #eee; text-align:left; }
    tbody tr:hover { background: rgba(0,123,255,0.04); transform:scale(1.0); }
    .status-badge { padding:6px 10px; border-radius:20px; font-weight:600; font-size:13px; display:inline-block; }
    .status-instock { background: rgba(0,200,83,0.08); color:#00c853; }
    .status-lowstock { background: rgba(255,193,7,0.08); color:#ffb300; }
    .status-outofstock { background: rgba(244,67,54,0.08); color:#f44336; }
    .action-btn { border:none; padding:6px 10px; border-radius:6px; font-size:13px; cursor:pointer; margin-right:6px; text-decoration:none; display:inline-block; }
    .action-view { background: rgba(0,123,255,0.08); color:var(--primary); }
    .action-edit { background: rgba(40,167,69,0.08); color:#28a745; }
    .action-delete { background: rgba(220,53,69,0.08); color:#dc3545; }
    .modal { display:none; position:fixed; inset:0; z-index:10000; background:rgba(0,0,0,0.4); justify-content:center; align-items:center; }
    .modal-content { background:var(--card-bg); padding:20px; border-radius:12px; width:520px; max-width:92%; box-shadow:0 6px 18px rgba(0,0,0,0.12); }
    .product-detail img { width:90px; height:90px; object-fit:cover; border-radius:10px; border:3px solid var(--primary); margin-bottom:8px; }
    @media (max-width:768px) { .page-header { flex-direction:column; align-items:flex-start; } .filters { width:100%; } .filters input, .filters select { width:100%; } }
</style>

<div class="main-content">
    <div class="products-container">
        <div class="page-header">
            <h2>Manage Products</h2>

            <form method="GET" action="{{ route('medical-inventory.index') }}" class="filters" style="margin-left:auto;">
                <select name="status" id="productFilter">
                    <option value="">All</option>
                    <option value="instock" {{ request('status')=='instock' ? 'selected' : '' }}>In Stock</option>
                    <option value="lowstock" {{ request('status')=='lowstock' ? 'selected' : '' }}>Low Stock</option>
                    <option value="outofstock" {{ request('status')=='outofstock' ? 'selected' : '' }}>Out of Stock</option>
                </select>

                <input type="text" name="q" id="productSearch" value="{{ request('q') }}" placeholder="Search products...">

                <a href="{{ route('medical-inventory.create') }}" class="add-btn">+ Add Product</a>

                <div class="export-btns">
                    @if (Route::has('medical-inventory.export.pdf'))
                        <a href="{{ route('medical-inventory.export.pdf', request()->query()) }}" class="export-btn">📄 Export PDF</a>
                    @endif
                </div>
            </form>
        </div>

        <div class="products-table">
            <table>
                <thead>
                    <tr>
                        <th>#</th><th>Product Name</th><th>Generic</th><th>Category</th><th>Seller</th><th>Price</th><th>Stock</th><th>Status</th><th style="min-width:180px">Actions</th>
                    </tr>
                </thead>
                <tbody id="productTableBody">
                    @forelse($inventories as $idx => $item)
                        @php
                            $stock = intval($item->stock ?? 0);
                            if ($stock <= 0) { $status='outofstock'; $statusLabel='Out of Stock'; $statusClass='status-outofstock'; }
                            elseif ($stock <= 50) { $status='lowstock'; $statusLabel='Low Stock'; $statusClass='status-lowstock'; }
                            else { $status='instock'; $statusLabel='In Stock'; $statusClass='status-instock'; }
                            $price = isset($item->price) ? number_format($item->price, 2) : '0.00';
                        @endphp
                        <tr data-status="{{ $status }}">
                            <td>{{ $idx + 1 }}</td>
                            <td>{{ $item->product_name }}</td>
                            <td>{{ $item->generic_name ?? '-' }}</td>
                            <td>{{ optional($item->category)->name ?? '-' }}</td>
                            <td>{{ optional($item->branch)->name ?? optional($item->brand)->name ?? '—' }}</td>
                            <td>${{ $price }}</td>
                            <td>{{ $stock }}</td>
                            <td><span class="status-badge {{ $statusClass }}">{{ $statusLabel }}</span></td>
                            <td>
                                <button type="button" class="action-btn action-view js-view-product" data-id="{{ $item->id }}">View</button>
                                <a href="{{ route('medical-inventory.edit', $item->id) }}" class="action-btn action-edit">Edit</a>
                                <form action="{{ route('medical-inventory.destroy', $item->id) }}" method="POST" style="display:inline">
                                    @csrf
                                    @method('DELETE')
                                    <button type="button" class="action-btn action-delete js-delete-btn">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @empty
                        <tr><td colspan="9" style="text-align:center; padding:18px;">No products found.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Product Modal -->
<div id="productModal" class="modal" aria-hidden="true" role="dialog">
    <div class="modal-content" role="document">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <h3 style="color:var(--primary); margin:0;">Product Details</h3>
            <button id="modalClose" class="action-btn" style="background:transparent; font-size:20px;">&times;</button>
        </div>
        <div class="product-detail" id="productDetail"></div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('productModal');
    const productDetail = document.getElementById('productDetail');
    const modalClose = document.getElementById('modalClose');

    document.body.addEventListener('click', function(e) {
        const el = e.target;

        if (el.classList.contains('js-view-product')) {
            const id = el.dataset.id;
            if (!id) return;
            productDetail.innerHTML = '<p>Loading...</p>';
            modal.style.display = 'flex';

            fetch("{{ url('medical-inventory') }}/" + id + "/json", {
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
            })
            .then(r => r.ok ? r.json() : Promise.reject(r.status))
            .then(data => {
                const image = data.image || '/images/placeholder.png';
                productDetail.innerHTML = `
                    <img src="${image}" alt="Product Image" onerror="this.src='/images/placeholder.png'">
                    <h4 style="margin:6px 0 4px;">${escapeHtml(data.product_name || '')}</h4>
                    <p><strong>Generic:</strong> ${escapeHtml(data.generic_name || '-')}</p>
                    <p><strong>Category:</strong> ${escapeHtml(data.category || '-')}</p>
                    <p><strong>Seller:</strong> ${escapeHtml(data.seller || '-')}</p>
                    <p><strong>Price:</strong> ${escapeHtml(data.price ?? '-')}</p>
                    <p><strong>Stock:</strong> ${escapeHtml(data.stock ?? '0')}</p>
                    <p><strong>Description:</strong> ${escapeHtml(data.description || '')}</p>
                `;
            })
            .catch(err => {
                productDetail.innerHTML = '<p>Unable to load details. Try again.</p>';
                console.error(err);
            });
        }

        if (el.classList.contains('js-delete-btn')) {
            if (!confirm('Confirm delete? This cannot be undone.')) return;
            const form = el.closest('form');
            if (form) form.submit();
        }
    });

    modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });
    function closeModal(){ modal.style.display = 'none'; }

    function escapeHtml(str){ if (typeof str !== 'string') return str; return str.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
});
</script>
@endsection
