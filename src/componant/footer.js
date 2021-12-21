import React from 'react'
import './tree.css';

function Footer() {
    return (
        <section id="footer">
            <div class="container">
                <div class="row">
                    <div class="col-xs-12 col-sm-12 col-md-12 mt-2 mt-sm-5">
                        <ul class="list-unstyled list-inline social text-center">
                            <li class="list-inline-item"><a href="#"><i class="fab fa-facebook"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="fab fa-twitter"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="fab fa-instagram"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="fab fa-google-plus-g"></i></a></li>
                            <li class="list-inline-item"><a href="#"><i class="far fa-envelope"></i></a></li>
                        </ul>
                    </div>
                    <hr />
                </div>
            </div>
        </section>
    )
}

export default Footer;